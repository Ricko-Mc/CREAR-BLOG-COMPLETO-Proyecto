const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Photo = require('../models/photo'); 
const { saveFile } = require('../service/storage');

const router = express.Router();

// Configurar almacenamiento en memoria para Multer.  Los archivos se
// mantendrán como búferes en memoria para poder pasarlos a Sharp sin
// tener que almacenarlos localmente.
const upload = multer({ storage: multer.memoryStorage() });

/*
 * Middleware ficticio para autenticación.  En una aplicación real
 * debería verificar el token JWT o la sesión y asociar la solicitud
 * con un usuario válido.  Aquí simplemente se define un usuario
 * predeterminado para fines de demostración.
 */
const fakeAuth = (req, res, next) => {
  // Supongamos que el usuario con id fijo está autenticado.
  req.user = { _id: '000000000000000000000001' };
  next();
};

/*
 * Ruta de subida de fotografías.  Recibe una imagen mediante
 * formulario multipart/form-data en el campo `image` y genera
 * automáticamente una miniatura y dos transformaciones (escala de
 * grises y sepia).  Cada archivo se sube al bucket S3 indicado en
 * `process.env.S3_BUCKET`.  Finalmente se crea un registro en la
 * colección de `photos` con las claves de S3 y se devuelve al
 * cliente.
 */
router.post('/photos', fakeAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
    }
    const userId = req.user._id;
    const originalName = req.file.originalname.replace(/\s+/g, '_');
    const timestamp = Date.now();
    // Nombres de archivo únicos
    const originalFile = `original_${timestamp}_${originalName}`;
    const thumbFile = `thumb_${timestamp}_${originalName}`;
    const grayFile = `gray_${timestamp}_${originalName}`;
    const sepiaFile = `sepia_${timestamp}_${originalName}`;

    // Guardar original
    const originalPath = await saveFile(req.file.buffer, 'original', originalFile);
    // Crear miniatura
    const thumbBuffer = await sharp(req.file.buffer)
      .resize({ width: 200 })
      .jpeg()
      .toBuffer();
    const thumbPath = await saveFile(thumbBuffer, 'thumb', thumbFile);
    // Escala de grises
    const grayBuffer = await sharp(req.file.buffer)
      .grayscale()
      .jpeg()
      .toBuffer();
    const grayPath = await saveFile(grayBuffer, 'gray', grayFile);
    // Sepia aproximado
    const sepiaBuffer = await sharp(req.file.buffer)
      .modulate({ saturation: 0.6 })
      .tint({ r: 112, g: 66, b: 20 })
      .jpeg()
      .toBuffer();
    const sepiaPath = await saveFile(sepiaBuffer, 'sepia', sepiaFile);

    // Guardar metadatos en la base de datos
    const photo = new Photo({
      user: userId,
      s3_key_original: originalPath,
      s3_key_thumbnail: thumbPath,
      transformations: [
        { type: 'grayscale', s3_key: grayPath },
        { type: 'sepia', s3_key: sepiaPath },
      ],
      description: req.body.description || '',
    });
    await photo.save();
    return res.status(201).json({
      message: 'Imagen cargada correctamente',
      photo,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al procesar la imagen' });
  }
});

/*
 * Ruta para obtener todas las fotografías del usuario autenticado.
 * Devuelve un arreglo de objetos con las claves de S3.  En una
 * aplicación real se podrían generar URLs firmadas para que el
 * cliente acceda a las imágenes directamente.
 */
router.get('/photos', fakeAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const photos = await Photo.find({ user: userId }).sort({ created_at: -1 });
    return res.json(photos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener las fotos' });
  }
});

/*
 * Ruta para obtener una fotografía específica junto con sus
 * transformaciones.  En lugar de devolver la imagen binaria, se
 * devuelven las claves de S3; el cliente debe solicitar al back‑end
 * o generar URLs firmadas para acceder al contenido.
 */
router.get('/photos/:id', fakeAuth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }
    // Verificar que pertenezca al usuario
    if (photo.user.toString() !== req.user._id) {
      return res.status(403).json({ message: 'No tiene permiso para acceder a esta foto' });
    }
    return res.json(photo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener la foto' });
  }
});

module.exports = router;