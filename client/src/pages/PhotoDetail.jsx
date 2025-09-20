import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../App.jsx';
import axios from 'axios';

const PhotoDetail = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3900/api'}/photos/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPhoto(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPhoto();
  }, [id, token]);

  // Construir URL local para mostrar la imagen usando la base de API.  Se
  // elimina el sufijo "/api" para apuntar a la raíz y se concatena
  // la ruta relativa devuelta por el servidor.
  const getImageUrl = (key) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3900/api';
    const base = apiUrl.replace(/\/api$/, '');
    return `${base}/${key}`;
  };

  if (!photo) {
    return (
      <div className="container">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Detalle de la fotografía</h2>
      <div className="photo-detail">
        <div>
          <h4>Original</h4>
          <img src={getImageUrl(photo.s3_key_original)} alt="Original" />
        </div>
        <div>
          <h4>Miniatura</h4>
          <img src={getImageUrl(photo.s3_key_thumbnail)} alt="Miniatura" />
        </div>
        {photo.transformations &&
          photo.transformations.map((t) => (
            <div key={t._id || t.s3_key}>
              <h4>{t.type}</h4>
              <img src={getImageUrl(t.s3_key)} alt={t.type} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default PhotoDetail;