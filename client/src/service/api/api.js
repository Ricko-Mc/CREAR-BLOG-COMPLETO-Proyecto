// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3900/api', 
});

export const registrarUsuario = (datos) => API.post('/registrar-usuario', datos);

// Enviamos los datos como parámetros en la URL
export const loginUsuario = ({ email, password }) =>
  API.post('/login', { email, password });

//para subir imagenes
export const subirImagen = (formData, token) =>
  API.post('/subir-perfil', formData, {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data'
    }
  });

  //Obtener data de usuario
export const ObtenerUsuario = (token) =>
  API.get('/obtener-usuario', {
    headers: {
      Authorization: `${token}`
    }
  });







  
