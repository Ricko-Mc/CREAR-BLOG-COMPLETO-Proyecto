// src/pages/Login.jsx
import { useState } from 'react';
import { loginUsuario } from '../../service/api/api';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importa los íconos para la contraseña

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate()//Funcion para redrigir al Home

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const res = await loginUsuario(form); // Enviamos username y password como parámetros
      alert('Login exitoso');
      nav('/home')
      console.log('Respuesta del backend:', res.data);
      // Aquí podrías guardar el token en localStorage y redirigir al usuario
    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
      console.error(err);
    }
  };


  return (

    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            className="form-input"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Ingresa tu email"
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>

          <div className="input-icon-wrapper">
            <input
              className="form-input with-icon"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              required
            />
            <span className="icon" onClick={togglePassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        <button className="login-button" type="submit">Entrar</button>
      </form>
      <p className="register-link">
        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
      </p>
    </div>

  );

}

export default Login;
