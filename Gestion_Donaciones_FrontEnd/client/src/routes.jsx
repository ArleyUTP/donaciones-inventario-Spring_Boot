import { Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import GestionUsuarios from './components/GestionUsuarios';
import GestionDonaciones from './components/GestionDonaciones';
import GestionDonadores from './components/GestionDonadores';
import Registro from './components/Registro';
import GestionDistribuciones from './components/GestionDistribuciones';
import GestionNecesidades from './components/GestionNecesidades';
import Necesidades from './components/Necesidades';
import GestionVoluntarios from './components/GestionVoluntarios';
import GestionAsignacionRecojo from './components/GestionAsignacionRecojo';
import Dashboard from './components/Dashboard/Dashboard';
import GestionInventario from './components/GestionInventario';
import GestionPublicaciones from './components/GestionPublicaciones';
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
      <Route path='/gestion-donaciones' element={<GestionDonaciones/>}/>
      <Route path='/gestion-donadores' element={<GestionDonadores/>}/>
      <Route path='/registro' element={<Registro/>}/>
      <Route path="/gestion-distribuciones" element={<GestionDistribuciones />} />
      <Route path="/gestion-necesidades" element={<GestionNecesidades />} />
      <Route path="/necesidades" element={<Necesidades />} />
      <Route path="/gestion-voluntarios" element={<GestionVoluntarios />} />
      <Route path="/asignacion-voluntarios" element={<GestionAsignacionRecojo />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path="/gestion-inventario" element={<GestionInventario />} />
      <Route path="/gestion-publicaciones" element={<GestionPublicaciones />} />
    </Routes>
  );
}