import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesignTemplate from '../../design-template/DesignTemplate';
import UsersTable from '../UsersTable';
import { GetUsersProvider } from '../local-contexts';
import ModalRegistrarUsuarios from '../modals/ModalRegistrarUsuarios';

const AdministradorUsuarios = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <DesignTemplate
      buttons={
        <>
          <Button
            appearance="link"
            onClick={() =>
              navigate('/administrar-usuarios/gestionar-etiquetas')
            }
          >
            Gestionar etiquetas
          </Button>
          <Button
            onClick={() => setIsOpen(true)}
            appearance="primary"
            iconBefore={<AddIcon label="" />}
          >
            Nuevo usuario
          </Button>
        </>
      }
    >
      <GetUsersProvider>
        <div className="flex justify-center w-full shadow-sm rounded">
          <UsersTable />
        </div>
        <ModalRegistrarUsuarios
          show={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      </GetUsersProvider>
    </DesignTemplate>
  );
};

export default AdministradorUsuarios;
