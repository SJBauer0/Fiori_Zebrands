<<<<<<< HEAD
import { useContext, useEffect } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { Main } from './containers';
import { UserContext, userDataContext } from './contexts';
import {
  LoginError,
  LoginSuccess,
  Login,
  NotFound404,
  NotRegistered,
  Unauthorized401,
} from './views';

function App() {
  const { user } = useContext(userDataContext);

  const renderConditionalRoutes = () => {
    if (!user) {
      return (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/login/success" element={<LoginSuccess />} />
          <Route path="/login/error" element={<LoginError />} />
          <Route
            path="/usernotregistered"
            element={<NotRegistered />}
          />
        </>
      );
    }
  };

  return (
    <UserContext>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={user ? '/dashboard' : '/login'} replace />
            }
          />
          {renderConditionalRoutes()}
          <Route path="/*" element={<Main />} />
          <Route path="/404" element={<NotFound404 />} />
          <Route path="/401" element={<Unauthorized401 />} />
        </Routes>
      </Router>
    </UserContext>
=======
import AdministrarUsuarios from './components/administrar-usuarios/views/AdministrarUsuarios';
import BorrarUsuarios from './components/administrar-usuarios/views/BorrarUsuarios';
import RegistrarUsuarios from './components/administrar-usuarios/views/RegistrarUsuarios';
import EditarUsuarios from './components/administrar-usuarios/views/EditarUsuarios';
import GestionarEtiquetas from './components/administrar-usuarios/views/GestionarEtiquetas';
import EtiquetasTable from './components/administrar-usuarios/EtiquetasTable';

function App() {
  return (
    <>
      {/* <AdministrarUsuarios /> */}
      <GestionarEtiquetas />
      {/* <EditarUsuarios /> */}
      {/* <BorrarUsuarios /> */}
      {/* <RegistrarUsuarios /> */}
      {/* <EtiquetasTable /> */}
    </>
>>>>>>> administrar-usuarios
  );
}

export default App;
