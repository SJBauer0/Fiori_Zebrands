import { useContext } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import Spinner from '../components/design-template/spinner/Spinner';
import { userDataContext } from '../contexts';
import {
  AdministrarUsuarios,
  Dashboard,
  GestionarRetrospectivas,
  Metricas,
  MisAccionables,
  MisRetrospectivas,
} from '../views';
import SessionExpired from '../views/iniciar-sesion/SessionExpired';
import Cookies from 'js-cookie';

const Main = () => {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    hasAttemptedFetch,
    sessionExpired,
    setSessionExpired,
  } = useContext(userDataContext);
  const idRol = user?.id_rol || -1;

  const adminAllowed = idRol === 1 || false;
  const responsableAllowed = idRol === 2 || false;

  if (!user && !Cookies.get('user')) {
    return <Navigate to={'/login'} replace />;
  }

  if (!hasAttemptedFetch && !sessionExpired && Cookies.get('user')) {
    return (
      <div className="w-screen h-screen">
        <Spinner
          message="Cargando, por favor espera un momento mientras preparamos todo para ti..."
          height="70%"
        />
      </div>
    );
  }

  const handleCloseModal = () => {
    setUser(null);
    setSessionExpired(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
      <Routes>
        {user && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/metricas/*" element={<Metricas />} />
            <Route
              path="/mis-retrospectivas/*"
              element={<MisRetrospectivas />}
            />
            <Route
              path="/mis-accionables/*"
              element={<MisAccionables />}
            />
            <Route
              path="/gestionar-retrospectivas/*"
              element={
                adminAllowed || responsableAllowed ? (
                  <GestionarRetrospectivas />
                ) : (
                  <Navigate to={'/401'} replace />
                )
              }
            />
            <Route
              path="/administrar-usuarios/*"
              element={
                adminAllowed ? (
                  <AdministrarUsuarios />
                ) : (
                  <Navigate to={'/401'} replace />
                )
              }
            />
          </>
        )}
        <Route path="*" element={<Navigate to={'/404'} replace />} />
      </Routes>
      {sessionExpired && (
        <SessionExpired handleCloseModal={handleCloseModal} />
      )}
    </>
  );
};

export default Main;
