// src/App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registro from './pages/inicio/Registrar';
import Login from './pages/inicio/Login';
import Home from './pages/Home'
import CrearPerfil from './pages/inicio/CrearPerfil'
import LoginSection from './components/LoginSection';
//import PhotoDetail from './pages/PhotoDetail';

function App() {
  return (
<LoginSection>

      
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/crear-perfil" element={<CrearPerfil />} />
        </Routes>
      </Router>
      
    </LoginSection>

  );

}
//<Route path="/photo/:id" element={token ? <PhotoDetail /> : <Navigate to="/login" />} />
export default App;
