const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: String,
    bio: String,
    nick: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "role_user"
    },
    image: {
        type: String,
        default: "default.jpg"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Agregar el plugin de paginación al esquema
userSchema.plugin(mongoosePaginate);

// Exportar el modelo corregido
module.exports = model("User", userSchema, "users");
