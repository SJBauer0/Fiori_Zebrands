import Button from '@atlaskit/button';
import { useNavigate } from 'react-router-dom';
import { FC, useContext } from 'react';
import SwitcherIcon from '@atlaskit/icon/glyph/switcher';
import { userDataContext } from '../../contexts';

const BotonReporte: FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(userDataContext);
  if (user?.id_rol === 2 || user?.id_rol === 3) {
    return null;
  }

  return (
    <>
      <Button
        appearance="link"
        onClick={() => {
          navigate('/gestionar-retrospectivas');
        }}
        iconBefore={<SwitcherIcon label="Gestionar Retrospectivas" />}
      >
        Gestionar Retrospectivas
      </Button>
    </>
  );
};

export default BotonReporte;
