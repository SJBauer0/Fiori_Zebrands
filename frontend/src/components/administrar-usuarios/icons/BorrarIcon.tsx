import TrashIcon from '@atlaskit/icon/glyph/trash';
import { N500, R400 } from '@atlaskit/theme/colors';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { userDataContext } from '../../../contexts';
import ModalBorrarUsuarios from '../modals/ModalBorrarUsuarios';

interface BorrarIconProps {
  idUsuario: number;
  nombreUsuario: string;
}

const BorrarIcon: FC<BorrarIconProps> = ({
  idUsuario,
  nombreUsuario,
}) => {
  const { user } = useContext(userDataContext);
  const [color, setColor] = useState(N500);
  const [isOpen, setIsOpen] = useState(false);
  const [isActualUser, setIsActualUser] = useState(false);

  useEffect(() => {
    if (user?.id_usuario === idUsuario) setIsActualUser(true);
  }, []);

  const handleMouseOverBorrar = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setColor(R400);
  };
  const handleMouseOutBorrar = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setColor(N500);
  };

  return (
    <>
      <button
        className={`w-7 ${isActualUser ? 'cursor-not-allowed' : ''}`}
        onMouseOver={!isActualUser ? handleMouseOverBorrar : () => {}}
        onMouseOut={!isActualUser ? handleMouseOutBorrar : () => {}}
        onClick={() => (!isActualUser ? setIsOpen(true) : null)}
      >
        <a
          data-tooltip-id={isActualUser ? 'anon-tooltip' : ''}
          data-tooltip-content={
            'No puedes eliminar a tu propio usuario.'
          }
        >
          <TrashIcon
            label="Trash Icon"
            primaryColor={isActualUser ? '#dedede' : color}
          />
        </a>
      </button>
      <ModalBorrarUsuarios
        nombre={nombreUsuario}
        show={isOpen}
        onClose={() => setIsOpen(false)}
        id={idUsuario}
      />
      <Tooltip id="anon-tooltip" className="text-xs bg-deepBlue" />
    </>
  );
};

export default BorrarIcon;
