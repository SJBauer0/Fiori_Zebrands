import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import React, { FC, useState } from 'react';
import ModalCompletarAccionable from './modals/ModalCompletarAccionable';

interface CheckAccionableIconProps {
  id_accionable: number;
}

const CheckAccionableIcon: FC<CheckAccionableIconProps> = ({
  id_accionable,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <>
      <button
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center ${
          isHovered ? 'underline' : ''
        }`}
      >
        <EditorPanelIcon label="detalles" primaryColor={'#2684ff'} />
        <p className={`text-xs text-[#2684ff]`}>Ver detalles</p>
      </button>
      {isModalOpen && (
        <ModalCompletarAccionable
          setIsModalOpen={setIsModalOpen}
          id_accionable={id_accionable}
        />
      )}
    </>
  );
};

export default CheckAccionableIcon;
