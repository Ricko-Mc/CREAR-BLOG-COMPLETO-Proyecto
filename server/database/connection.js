const mongoose =  require("mongoose");

const connection = async() => {
    try{
        await mongoose.connect("mongodb://localhost:27017/mi_red_social");
        console.log("Se ha conectado correctamente a la base de datos.");
    }catch(err){
        console.log(err);
        throw new Error("No se pudo conectar a la base de datos!!");
    }
}

module.exports={connection};
