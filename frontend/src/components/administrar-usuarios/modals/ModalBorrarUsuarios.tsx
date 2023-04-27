import Button from '@atlaskit/button/standard-button';
import axios from 'axios';
import { FC, useContext } from 'react';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import EditorErrorIcon from '@atlaskit/icon/glyph/editor/error';
import InfoIcon from '@atlaskit/icon/glyph/info';
import { FlagContext } from '../../../contexts';
import { getUsersContext } from '../local-contexts';
import CrossIcon from '@atlaskit/icon/glyph/cross';

const URI = `${
  import.meta.env.VITE_APP_BACKEND_URI
}/usuarios/deleteUser/`;

interface BorrarUsuarioProps {
  show: boolean;
  onClose: () => void;
  id: number;
  nombre: string;
}

const ModalBorrarUsuarios: FC<BorrarUsuarioProps> = ({
  show,
  onClose,
  id,
  nombre,
}) => {
  const { addFlag } = useContext(FlagContext);
  const { getUsers } = useContext(getUsersContext);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${URI}${id}`);
      getUsers();
      addFlag(
        '¡Listo! Usuario eliminado correctamente.',
        InfoIcon,
        'info'
      );
      onClose();
    } catch (error) {
      console.log('error');
      if (error instanceof Error) {
        addFlag(
          '¡Oh no! Hubo un error al intentar eliminar al usuario. Por favor, inténtalo de nuevo más tarde o contacta soporte.',
          EditorErrorIcon,
          'error',
          error.toString()
        );
      } else {
        addFlag(
          '¡Oh no! Hubo un error al intentar finalizar al usuario. Por favor, inténtalo de nuevo más tarde o contacta soporte.',
          EditorErrorIcon,
          'error',
          'Error desconocido'
        );
      }
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="z-[1000] bg-blueRGBA fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center">
      <div className="flex flex-col bg-white rounded py-12 px-10 gap-8 items-center justify-center drop-shadow-lg max-w-[40vw]">
        <div className="w-full flex flex-col items-center">
          <div
            className="flex w-full absolute top-0 justify-end p-4"
            onClick={onClose}
          >
            <div className="flex items-center justify-center cursor-pointer p-1">
              <CrossIcon label="cerrar modal" size="small" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 relative">
            <h3 className="font-bold text-modalSoft text-xl text-center">
              ¿Estás seguro que deseas eliminar{' '}
              {nombre ? `el usuario de ${nombre}` : 'este usuario'}?
            </h3>
          </div>
        </div>
        <div className="w-full flex gap-2 items-center justify-center px-6">
          <WarningIcon label="warning" primaryColor="#FF0000" />
          <p className="text-xs text-textNormal">
            Se perderán todos sus datos y no podrá acceder nuevamente
            a RetroZeb.
          </p>
        </div>

        <div
          className="flex items-center justify-center
            w-full gap-8 mt-2"
        >
          <Button appearance="subtle" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            appearance="danger"
            onClick={() => handleDelete(id)}
          >
            Eliminar usuario
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalBorrarUsuarios;
