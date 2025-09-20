const User = require("../modelos/models_user");
const jwt = require("../service/services_jwt");
const bcrypt = require("bcrypt");
const path = require("path");

//Crear token para el login o el registro de usuarios
function CrearToken(user){
    return jwt.createToken(user);
}

const pruebaUser = async(req, res) => {

    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }
        res.status(200).json({ status: 'success', user });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error al obtener usuario', error: err.message });
    }

}

// Registro de usuarios
const register = async (req, res) => {
    try {
        // Recoger datos de la petición
        let params = req.body;

        // Comprobar que me llegan bien (+validación)
        if (!params.name || !params.email || !params.password || !params.nick || !params.surname) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        // Control usuarios duplicados
        const users = await User.find({
            $or: [
                { email: params.email.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        }).exec();

        if (users && users.length >= 1) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            });
        }

        // Cifrar la contraseña 
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        // Crear objeto de usuario
        let user_to_save = new User(params);

        // Guardar usuario en la BD
        const userStored = await user_to_save.save(); // Eliminar callback, usando await

        //Crear token
        const token = CrearToken(user_to_save)

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            message: "Usuario registrado correctamente",
            user: userStored,
            token
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en la consulta de usuarios",
            error: error.message
        });
    }
};

//Controlador para subir imagen
const subirImagen = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ status: 'error', message: 'No se subió ninguna imagen' });
    }
    const id =  req.user.id
    const fileName = req.file.filename;
    
    // Actualizar el campo image del usuario
    const userUpdated = await User.findByIdAndUpdate(
      id,
      { image: fileName },
      { new: true }
    ).select('-password');

    return res.status(200).send({
      status: 'success',
      message: 'Imagen subida correctamente',
      user: userUpdated
    });
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      message: 'Error al subir imagen',
      error: error.message
    });
  }
};


//Autenticación de usuario
const login = async (req, res) => {

    try {
        // Recoger parámetros del body

        let params = req.body;

        if (!params.email || !params.password) {
            return res.status(400).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        // Buscar en la BD si existe el email o usuario
        const user = await User.findOne({ email: params.email })
            .select({ name: 1, surname: 1, nick: 1, email: 1, role: 1, image: 1, password: 1 })
            .exec();


        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "No existe el usuario"
            });
        }

        // Comprobar la contraseña
        const coincide = await bcrypt.compare(params.password, user.password);
        if (!coincide) {
            return res.status(400).send({
                status: "error",
                message: "Contraseña incorrecta"
            });
        }

        // Si es necesario, aquí puedes generar un token JWT, por ejemplo:
        token = CrearToken(user);

        //const token = jwt.sign({ id: user._id }, 'tu_secreto', { expiresIn: '1h' });

        // Excluir la contraseña antes de devolver los datos del usuario
        user.password = undefined;

        // Devolver los datos del usuario (y el token si usas JWT)
        return res.status(200).send({
            status: "success",
            message: "Login exitoso",
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                nick: user.nick,
                email: user.email,
                role: user.role,
                image: user.image
            },
            token
        });


    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el proceso de login",
            error: error.message
        });
    }
};


module.exports = { pruebaUser, login, register, subirImagen };