import React, { FC } from 'react';
import Lozenge from '@atlaskit/lozenge';

interface RolIconProps {
  rol: any;
}

const RolIcon: FC<RolIconProps> = ({ rol }) => {
  if (rol == 'Administrador') {
    return <Lozenge appearance="moved">{rol}</Lozenge>;
  } else if (rol == 'Responsable') {
    return <Lozenge appearance="inprogress">{rol}</Lozenge>;
  } else if (rol == 'Squad Member') {
    return <Lozenge appearance="new">{rol}</Lozenge>;
  } else {
    return <Lozenge>NULL</Lozenge>;
  }
};

export default RolIcon;