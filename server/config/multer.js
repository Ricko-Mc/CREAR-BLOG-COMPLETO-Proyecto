
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userName = req.user.name || 'default';
    const uploadPath = path.join(__dirname, '../uploads', userName);

    // Crear carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `image_${Date.now()}${ext}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

module.exports = upload;
