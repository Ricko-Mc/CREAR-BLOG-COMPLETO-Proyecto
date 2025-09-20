
import { useState } from 'react';
import { registrarUsuario } from '../../service/api/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function Registro() {
  const [form, setForm] = useState({
    name: '', surname: '', bio: '', nick: '', email: '', password: '', confirmPassword: '', role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [matchError, setMatchError] = useState('');
  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') validatePassword(value);
    if (name === 'confirmPassword') validateMatch(form.password, value);
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    setPasswordError(
      regex.test(password)
        ? ''
        : 'La contraseña debe tener al menos 6 caracteres, una letra y un número.'
    );
  };

  const validateMatch = (password, confirmPassword) => {
    setMatchError(
      password === confirmPassword
        ? ''
        : 'Las contraseñas no coinciden.'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError || matchError) return;

    try {
      const res = await registrarUsuario(form);
      alert('Usuario registrado correctamente');
      setError('');
      //console.log(res.data)
      localStorage.setItem('token', res.data.token);
      nav('/crear-perfil');

    } catch (err) {
      alert('Error al registrar usuario');
      setError('');
    }
  };

  return (
    <div className="registro-container">
      <h2 className="registro-title">Registro de Usuario</h2>
      <form className="registro-form" onSubmit={handleSubmit}>
        <div className='form-group-line'>
          <div className="form-group">
            <label>Nombre:</label>
            <input className="form-input" name="name" placeholder="Nombre" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Apellido:</label>
            <input className="form-input" name="surname" placeholder="Apellido" onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group">
          <label>Biografía:</label>
          <textarea className="form-input-area" name="bio" placeholder="Cuéntanos sobre ti" onChange={handleChange} required />
        </div>
        <div className='form-group-line'>
        <div className="form-group">
          <label>Nick:</label>
          <input className="form-input" name="nick" placeholder="Nombre de usuario" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input className="form-input" name="email" type="email" placeholder="Email" onChange={handleChange} required />
        </div>
</div>
        <div className="form-group">
          <label>Contraseña:</label>
          <div className="input-icon-wrapper">
            <input
              className="form-input with-icon"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              onChange={handleChange}
              required
            />
            <span className="icon" onClick={togglePassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {passwordError && <p className="error-message">{passwordError}</p>}
        </div>

        {/* Confirmar contraseña */}
        <div className="form-group">
          <label>Confirmar Contraseña:</label>
          <div className="input-icon-wrapper">
            <input
              className="form-input with-icon"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repite la contraseña"
              onChange={handleChange}
              required
            />
            <span className="icon" onClick={toggleConfirmPassword}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {matchError && <p className="error-message">{matchError}</p>}
        </div>

        <div className="form-group">
          <label>Rol:</label>
          <select className="form-input" name="role" onChange={handleChange} required>
            <option value="">Selecciona un rol</option>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button className="registro-button" type="submit">Registrar</button>
      </form>
      <p className="register-link">
        ¿Ya tienes cuenta? <Link to="/login">Iniciar Sesión</Link>
      </p>
    </div>
  );
}

export default Registro;
