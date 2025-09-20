const fs = require('fs');
const path = require('path');

/*
 * Servicio de almacenamiento local para el entorno sin conexión.  Este
 * módulo proporciona funciones para guardar archivos en el disco
 * dentro de una carpeta `uploads` en el servidor.  Cada subcarpeta
 * (por ejemplo `original`, `thumb`, `gray`, `sepia`) se crea
 * automáticamente si no existe.  Se devuelve la ruta relativa
 * utilizada para acceder al archivo de forma estática.
 */

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function saveFile(buffer, subdir, filename) {
  const dirPath = path.join(UPLOAD_DIR, subdir);
  ensureDir(dirPath);
  const filePath = path.join(dirPath, filename);
  await fs.promises.writeFile(filePath, buffer);
  // devolver ruta relativa: uploads/subdir/filename
  const relPath = path.join('uploads', subdir, filename);
  return relPath.replace(/\\/g, '/');
}

module.exports = { saveFile };