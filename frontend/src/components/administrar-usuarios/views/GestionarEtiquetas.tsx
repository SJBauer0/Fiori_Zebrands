import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesignTemplate from '../../design-template/DesignTemplate';
import EtiquetasTable from '../EtiquetasTable';
import { GetEtiquetasProvider } from '../local-contexts';

import ModalRegistrarEtiqueta from '../modals/ModalRegistrarEtiqueta';

const GestionarEtiquetas = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <DesignTemplate
      buttons={
        <>
          <Button
            appearance="link"
            onClick={() => navigate('/administrar-usuarios')}
          >
            Volver a tabla de usuarios
          </Button>
          <Button
            onClick={() => setIsOpen(true)}
            appearance="primary"
            iconBefore={<AddIcon label="" />}
          >
            Nueva etiqueta
          </Button>
        </>
      }
    >
      <GetEtiquetasProvider>
        <div className="flex items-center justify-center w-full bg-white py-4 shadow-sm rounded">
          <EtiquetasTable />
          <ModalRegistrarEtiqueta
            show={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </GetEtiquetasProvider>
    </DesignTemplate>
  );
};

export default GestionarEtiquetas;
