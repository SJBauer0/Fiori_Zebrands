import axios from 'axios';
import {
  FC,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import DropdownEtiquetas from '../DropdownEtiquetas';
import DropdowRoles from '../DropdownRoles';
import DropdownUsuariosJira from '../DropdownUsuariosJira';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import SectionMessage from '@atlaskit/section-message';
import { userDataContext } from '../../../contexts';
import { type Etiqueta } from '../local-contexts';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import EditorErrorIcon from '@atlaskit/icon/glyph/editor/error';
import { FlagContext } from '../../../contexts';

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
          <div className="p-10 bg-white rounded-xl flex flex-col">
            <div className="w-full flex flex-col items-center">
              <div className="w-full text-xl font-bold mb-1 flex items-center justify-between">
                <h4>Modificar Usuario</h4>
                <button onClick={() => onClose()}>
                  <CrossIcon label="Cross Icon" />
                </button>
              </div>
              <div className="w-full text-sm text-[#44546f] mb-5">
                Modifica los datos de un usuario en el sistema.
              </div>
            </div>
            <div className="w-full flex flex-col justify center">
              <p className="font-bold text-left mb-4">
                Detalles de usuario
              </p>
              <SectionMessage appearance="information">
                <p className="text-[#0055CC] text-xs ">
                  Algunos detalles están deshabilitados debido a que
                  la cuenta del usuario está conectada a una cuenta de
                  Google.
                </p>
              </SectionMessage>
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
                    disabled={true}
                    className="h-8 border-2 border-gray0 rounded-sm p-2 disabled:bg-[#F1F2F4]"
                  ></input>
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
            <div className="w-full flex items-center justify-end">
              <div className="flex gap-10 mt-8">
                <button
                  className="rounded-none hover:text-blue-500 text-sm"
                  onClick={() => onClose()}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="EditarUsuarioForm"
                  className="rounded-sm bg-jiraBlue text-white px-2 py-1 hover:bg-blue-500"
                >
                  <p className="text-sm">
                    Actualizar datos de usuario
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default ModalEditarUsuarios;
