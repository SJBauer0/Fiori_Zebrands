import CrossIcon from '@atlaskit/icon/glyph/cross';
import emailjs from '@emailjs/browser';
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
import '../css/modalRegistrarUsuarios.css';
import { getUsersContext, type Etiqueta } from '../local-contexts';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import EditorErrorIcon from '@atlaskit/icon/glyph/editor/error';
import { FlagContext } from '../../../contexts';
import Button from '@atlaskit/button';

const URI = `${
  import.meta.env.VITE_APP_BACKEND_URI
}/usuarios/createUser`;

interface RegistrarUsuariosProps {
  show: boolean;
  onClose: () => void;
}

const ModalRegistrarUsuarios: FC<RegistrarUsuariosProps> = ({
  show,
  onClose,
}) => {
  const { addFlag } = useContext(FlagContext);
  const { getUsers } = useContext(getUsersContext);
  const [correo, setCorreo] = useState('');
  const [dominioCorreo, setDominioCorreo] = useState('@zeb.mx');
  const [rol, setRol] = useState('');
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [usuarioJira, setUsuarioJira] = useState(null);
  const [otroDominio, setOtroDominio] = useState(false);

  const handleRolSeleccionado = (rol: string) => {
    setRol(rol);
  };

  const handleEtiquetasSeleccionadas = (etiquetas: Etiqueta[]) => {
    setEtiquetas(etiquetas);
  };

  const handleUsuarioSeleccionado = (usuario: any) => {
    setUsuarioJira(usuario);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(URI, {
        correo: `${correo}${dominioCorreo}`,
        rol: Number(rol),
        etiquetas: etiquetas,
        usuario_jira: usuarioJira,
      });
      getUsers();
      addFlag(
        '¡Perfecto! El usuario ha sido registrado exitosamente.',
        CheckCircleIcon,
        'success'
      );
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        addFlag(
          '¡Oh no! Hubo un error al registrar al usuario. Inténtalo de nuevo más tarde o contacta soporte.',
          EditorErrorIcon,
          'warning',
          error.toString()
        );
      } else {
        console.log(error);
        addFlag(
          '¡Oh no! Hubo un error al registrar al usuario. Inténtalo de nuevo más tarde o contacta soporte.',
          EditorErrorIcon,
          'warning',
          'Error desconocido'
        );
      }
    }
    try {
      emailjs.send(
        'service_yhwmvyx',
        'template_6dsa5hr',
        {
          to_email: `${correo}${dominioCorreo}`,
        },
        'huMoBlbtLZGwi0vSZ'
      );
    } catch (error) {
      console.log(
        '¡Oh no! Hubo un error al enviar el correo al usuario',
        error
      );
    }
    setOtroDominio(false);
    setDominioCorreo('');
    setCorreo('');
    setRol('');
  };

  const handleClose = () => {
    setCorreo('');
    setRol('');
    onClose();
  };

  const handleDominioChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === 'otro') {
      setOtroDominio(true);
      setDominioCorreo('');
    } else {
      setOtroDominio(false);
      setDominioCorreo(e.target.value);
    }
  };

  const handleRegresarDropdown = () => {
    setOtroDominio(false);
    setDominioCorreo('@zeb.mx');
  };

  if (!show) {
    return null;
  }
  return (
    <>
      <div className="z-[1000] bg-blueRGBA fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center">
        <div className="p-10 bg-white rounded flex flex-col w-[50vw]">
          <div className="w-full flex flex-col items-center">
            <div className="w-full mb-1 flex items-center justify-between font-semibold text-base">
              <h4>Registrar nuevo usuario</h4>
              <div
                className="flex items-center justify-center cursor-pointer p-1"
                onClick={handleClose}
              >
                <CrossIcon label="cerrar modal" size="small" />
              </div>
            </div>
            <p className="w-full text-xs text-[#44546f] mb-5">
              Después de registrar al usuario, se le hará llegar una
              invitación por correo electrónico para ingresar a
              RetroZeb.
            </p>
          </div>
          <div className="w-full flex flex-col justify center mt-2">
            <form
              onSubmit={handleSubmit}
              className="w-full"
              id="RegistrarUsuarioForm"
            >
              <div className="flex flex-col mb-5">
                <label id="label-correo">Usuario de Jira</label>
                <div className="flex w-full gap-4">
                  <DropdownUsuariosJira
                    onUsuarioSeleccionadoChange={
                      handleUsuarioSeleccionado
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="correo" id="label-correo">
                  Correo
                </label>
                <div className="flex w-full gap-2">
                  <input
                    required
                    pattern="^[a-zA-Z0-9._-]+"
                    title="Solo se permiten letras, números, puntos, guiones y guiones bajos"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    type="text"
                    name="correo"
                    id="input-correo"
                    className="border-2 border-gray !w-full rounded-sm p-2 focus:outline-gray-400 hover:bg-gray-100"
                    autoComplete="off"
                    placeholder="Ingresa el correo electrónico"
                  />
                  {otroDominio ? (
                    <>
                      <input
                        required
                        value={dominioCorreo}
                        onChange={(e) =>
                          setDominioCorreo(e.target.value)
                        }
                        //the next regex validates that the input is a valid domain starting with @ and following letters, numbers, dashes or dots
                        pattern="^@([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$"
                        title="Ingresa un dominio válido"
                        type="text"
                        name="dominioCorreo"
                        id="input-dominio-correo"
                        className="border-2 border-gray rounded-sm p-2 focus:outline-gray-400 hover:bg-gray-100"
                        autoComplete="off"
                        placeholder="Ingresa el dominio"
                      />
                      <Button
                        appearance="subtle"
                        className="!text-xs !items-center"
                        onClick={handleRegresarDropdown}
                      >
                        Volver a elegir un dominio
                      </Button>
                    </>
                  ) : (
                    <select
                      onChange={handleDominioChange}
                      value={dominioCorreo}
                      className="w-full h-8 bg-[#F1F2F4] rounded-md pl-2 hover:bg-gray-200 text-sm text-gray-600 font-medium focus:border-0"
                    >
                      <option>@zeb.mx</option>
                      <option>@luuna.mx</option>
                      <option>@mappa.mx</option>
                      <option value="otro">Otro</option>
                    </select>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <label htmlFor="rol" id="label-rol">
                  Rol
                </label>
                <DropdowRoles
                  onRolSeleccionadoChange={handleRolSeleccionado}
                  rolActual={''}
                />
              </div>
              <div className="flex flex-col mt-4 mb-2">
                <label htmlFor="etiquetas" id="label-etiquetas">
                  Etiquetas
                </label>
                <DropdownEtiquetas
                  onEtiquetasSeleccionadasChange={
                    handleEtiquetasSeleccionadas
                  }
                  etiquetasActuales={[]}
                />
              </div>
            </form>
          </div>
          <div
            className="flex items-center justify-end
            w-full gap-10 lg:flex-row flex-col mt-7"
          >
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              appearance="primary"
              type="submit"
              form="RegistrarUsuarioForm"
            >
              Registrar usuario
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalRegistrarUsuarios;
