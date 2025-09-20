const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const {auth} = require('../middlewares/middlewares_auth');
const upload = require("../config/multer")

//Definir rutas
router.get("/prueba-usuario", auth, userController.pruebaUser);
//Obtener data de usuario
router.get("/obtener-usuario", auth, userController.pruebaUser);
//Registrar usuario
router.post("/registrar-usuario", userController.register);
//Login
router.post("/login", userController.login)
//Subir foto de perfil
router.post("/subir-perfil", auth, upload.single('image'), userController.subirImagen);




module.exports = router 