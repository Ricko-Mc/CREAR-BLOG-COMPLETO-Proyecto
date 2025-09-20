const mongoose = require('mongoose');

/*
 * Esquema Mongoose para almacenar metadatos de fotografías.  Cada
 * fotografía pertenece a un usuario y mantiene referencias a las
 * diferentes versiones almacenadas en S3: la imagen original, la
 * miniatura y las transformaciones generadas automáticamente.  Las
 * transformaciones se almacenan en un arreglo de objetos con el
 * tipo de transformación y su clave en S3.
 */

const TransformationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  s3_key: { type: String, required: true },
});

const PhotoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  s3_key_original: { type: String, required: true },
  s3_key_thumbnail: { type: String, required: true },
  transformations: [TransformationSchema],
  description: { type: String },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Photo', PhotoSchema, 'photos');