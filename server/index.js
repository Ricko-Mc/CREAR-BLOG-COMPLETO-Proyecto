//Importar dependencias
const {connection} = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Mensajes de bienvenida
console.log("API node para RED SOCIAL arrancada");

//Crear el servidor node
connection();

//Configurar cors o el mildware
const app = express();
const puerto = 3900;

//Converitr los datos del body en objetos JS
app.use(cors());

//Configuracion de las rutas.
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Cargar las rutas
//Usuario
const userRoutes = require("./rutas/user");
app.use("/api", userRoutes);

//Followers
const followRoutes = require("./rutas/follow");
app.use("/api", followRoutes);

//Publication
const publicationRoutes = require("./rutas/publication");
app.use("/api", publicationRoutes);

//Ruta de prueba
app.get("/ruta-prueba",(req, res)=>{
    return res.status(200).json({
        "id":1,
        "nombre":"CArlos Arial",
        "web":"loco"
    })
});

const photoRoutes = require('./rutas/photo');
app.use('/api', photoRoutes);

//Poner al servidor a escuchar peticiones
app.listen(puerto, ()=>{
    console.log("Servidor de Node.JS corriendo en el puerto: " + puerto);
});