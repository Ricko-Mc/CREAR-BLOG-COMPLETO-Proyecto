// src/pages/Perfil.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ObtenerUsuario, subirImagen } from '../../service/api/api';


function CrearPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [imagenModificada, setImagenModificada] = useState(false);
  const [imagenPreview, setImagenPreview] = useState('/images/default.jpg');
  const nav = useNavigate();

  // Obtener datos del usuario al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token)
    ObtenerUsuario(token)
      .then(res => setUsuario(res.data.user))
      .catch(err => console.error('Error al obtener usuario:', err));

  }, []);


  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImagen(file);
      setImagenModificada(true);
    } else {
      alert('Solo se permiten imágenes PNG o JPG');
    }
  };

  const handleSiguiente = async () => {
    if (imagenModificada && imagen) {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', imagen);

      try {
        await subirImagen(formData, token);
        alert('Imagen subida correctamente');
      } catch (err) {
        alert('Error al subir imagen');
        console.error(err);
      }
    }

    nav('/home');
  };


  return (
    <div className="perfil-container">
      <h2>Bienvenido, {usuario?.name} {usuario?.surname}</h2>
      <div className="perfil-form">
        <label>Foto de perfil:</label>

        <label htmlFor="file-upload" className="imagen-preview">
          <img
            src={imagenPreview}
            alt="Foto de perfil"
            className="perfil-imagen"
          />
        </label>

        <input
          id="file-upload"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImagenChange}
          style={{ display: 'none' }}
        />

        <button onClick={handleSiguiente}>Siguiente</button>
      </div>

    </div>
  );
}

export default CrearPerfil;
