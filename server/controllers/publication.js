const pruebaPublication = (req, res) =>{
    return res.status(200).send({
        message : "Mensaje enviado"
    })
};

module.exports = {pruebaPublication}