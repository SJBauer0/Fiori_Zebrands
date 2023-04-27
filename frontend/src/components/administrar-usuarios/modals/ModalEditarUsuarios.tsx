import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import EditorErrorIcon from '@atlaskit/icon/glyph/editor/error';
import axios from 'axios';
import {
  FC,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { FlagContext, userDataContext } from '../../../contexts';
import DropdownEtiquetas from '../DropdownEtiquetas';
import DropdowRoles from '../DropdownRoles';
import DropdownUsuariosJira from '../DropdownUsuariosJira';
import { getUsersContext, type Etiqueta } from '../local-contexts';
import { HelperMessage } from '@atlaskit/form';
import Button from '@atlaskit/button';

const URI = `${import.meta.env.VITE_APP_BACKEND_URI}/usuarios/`;

interface ModalEditarUsuariosProps {
  show: boolean;
  onClose: () => void;
  info: string | number;
}

const ModalEditarUsuarios: FC<ModalEditarUsuariosProps> = ({
  show,
  onClose,
  info,
}) => {
  const { addFlag } = useContext(FlagContext);
  const { user } = useContext(userDataContext);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState('');
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>();
  const [usuarioJira, setUsuarioJira] = useState(null);

  const handleRolSeleccionado = (rol: string) => {
    setRol(rol);
  };

  const handleEtiquetasSeleccionadas = (etiquetas: Etiqueta[]) => {
    setEtiquetas(etiquetas);
  };

  const handleUsuarioSeleccionado = (usuario: any) => {
    setUsuarioJira(usuario);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = axios.post(`${URI}/updateUser/${info}`, {
        nombre: nombre,
        rol: rol,
        etiquetas: etiquetas,
        id_jira: usuarioJira,
      });
      res.then(() => {
        addFlag(
          '¡Bien! Los datos del usuario se han actualizado exitosamente.',
          CheckCircleIcon,
          'success'
        );
        onClose();
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        addFlag(
          '¡Oh no! Hubo un error al actualizar los datos del usuario. Inténtalo de nuevo más tarde o contacta soporte.',
          EditorErrorIcon,
          'warning',
          error.toString()
        );
      } else {
        console.log(error);
        addFlag(
          '¡Oh no! Hubo un error al actualizar los datos del usuario. Inténtalo de nuevo más tarde o contacta soporte.',
          EditorErrorIcon,
          'warning',
          'Error desconocido'
        );
      }
    }
  };

  const getUsuario = () => {
    try {
      const res = axios.get(`${URI}info/one/${info}`);
      res.then((response) => {
        const usuario = response.data.usuario.shift();
        setNombre(
          usuario.nombre ||
            'Nuevo usuario (sin autenticar con Google)'
        );
        setCorreo(usuario.correo);
        setRol(usuario.rol);
        setEtiquetas(usuario.etiquetas);
        setUsuarioJira(usuario.id_jira);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsuario();
  }, []);

  if (!show) {
    return null;
  } else {
    return (
      <>
        <div className="z-[1000] bg-blueRGBA fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center">
          <div className="p-10 bg-white rounded flex flex-col w-[50vw]">
            <div className="w-full flex flex-col items-center">
              <div className="w-full mb-1 flex items-center justify-between font-semibold text-base">
                <h4>Modificar usuario</h4>
                <div
                  className="flex items-center justify-center cursor-pointer p-1"
                  onClick={onClose}
                >
                  <CrossIcon label="cerrar modal" size="small" />
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col justify center">
              <form
                onSubmit={handleSubmit}
                action=""
                className="flex flex-col mt-4"
                id="EditarUsuarioForm"
              >
                <div className="flex gap-4 mb-5">
                  <div className="w-full flex flex-col">
                    <label
                      htmlFor="nombre"
                      className="text-xs text-[#626f86] font-semibold"
                    >
                      Nombre
                    </label>
                    <input
                      required
                      autoComplete="off"
                      type="text"
                      name="nombre"
                      className="h-8 border-2 border-gray0 rounded-sm p-2 focus:outline-gray-400 hover:bg-gray-100"
                      defaultValue={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col mb-5">
                  <label className="text-xs text-[#626f86] font-semibold">
                    Usuario de Jira
                  </label>
                  <div className="flex w-full gap-4">
                    <DropdownUsuariosJira
                      isRequired={false}
                      usuarioActual={usuarioJira}
                      onUsuarioSeleccionadoChange={
                        handleUsuarioSeleccionado
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col mb-5">
                  <label
                    htmlFor="correo"
                    className=" text-xs full text-[#626f86] font-semibold"
                  >
                    Correo
                  </label>
                  <input
                    type="text"
                    placeholder={correo}
                    disabled
                    className="h-8 border-2 border-gray0 rounded-sm p-2 disabled:bg-[#F1F2F4] cursor-not-allowed"
                  />
                  <HelperMessage>
                    El correo no puede ser modificado por estar
                    asociado a una cuenta de Google.
                  </HelperMessage>
                </div>
                <div className="flex flex-col mb-5">
                  <label
                    htmlFor="rol"
                    className=" text-xs full text-[#626f86] font-semibold"
                  >
                    Rol
                  </label>
                  <DropdowRoles
                    onRolSeleccionadoChange={handleRolSeleccionado}
                    rolActual={rol}
                    active={user?.id_usuario == info}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="etiquetas"
                    className="text-xs full text-[#626f86] font-semibold"
                  >
                    Etiquetas
                  </label>
                  <DropdownEtiquetas
                    etiquetasActuales={etiquetas}
                    onEtiquetasSeleccionadasChange={
                      handleEtiquetasSeleccionadas
                    }
                  />
                </div>
              </form>
            </div>
            <div
              className="flex items-center justify-end
            w-full gap-10 lg:flex-row flex-col mt-7"
            >
              <Button onClick={onClose}>Cancelar</Button>
              <Button
                appearance="primary"
                type="submit"
                form="EditarUsuarioForm"
              >
                Actualizar datos del usuario
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default ModalEditarUsuarios;
