import Avatar from '@atlaskit/avatar';
import DynamicTable from '@atlaskit/dynamic-table';
import type { RowType } from '@atlaskit/dynamic-table/dist/types/types';
import { FC, useContext } from 'react';
import { userDataContext } from '../../contexts';
import RolIcon from './RolIcon';
import TableHead from './UsersTableHead';
import {
  BorrarIcon,
  EditarIcon,
  EtiquetaIcon,
  ResponsableIcon,
} from './icons';
import { getUsersContext } from './local-contexts';
import Spinner from '../design-template/spinner/Spinner';

interface UsersTableProps {}

const UsersTable: FC<UsersTableProps> = ({}) => {
  const { userRows } = useContext(getUsersContext);
  const { user } = useContext(userDataContext);
  const tableRows: RowType[] = [];

  userRows.map((usuario, i) =>
    tableRows.push({
      key: usuario.id.toString(),
      isHighlighted: false,
      cells: [
        {
          key: `nombre-${
            usuario.nombre ||
            'Nuevo usuario (sin autenticar con Google)'
          }-${usuario.id}`,
          content: (
            <span className="flex items-center gap-2 ml-3 w-full">
              <Avatar src={usuario.foto} size="small" />
              <p className="w-full text-sm">
                {usuario.nombre ||
                  'Nuevo usuario (sin autenticar con Google)'}
                {user?.id_usuario === usuario.id && (
                  <span className="text-information"> (Tú)</span>
                )}
              </p>
            </span>
          ),
        },
        {
          key: `correo-${usuario.correo}`,
          content: (
            <p className="text-sm w-full ml-3">{usuario.correo}</p>
          ),
        },
        {
          key: `rol-${usuario.rol}`,
          content: (
            <div className="text-center">
              <RolIcon rol={usuario.rol} />
            </div>
          ),
        },
        {
          key: usuario.etiquetas[0]?.id + usuario.id,
          content: (
            <div className="flex justify-start">
              <EtiquetaIcon etiquetas={usuario.etiquetas} />
            </div>
          ),
        },
        {
          key: `responsable-${usuario.id}`,
          content: (
            <div className="flex justify-center">
              <ResponsableIcon
                usuario={{
                  id: usuario.id,
                  rol: usuario.rol,
                  nombre: usuario.nombre,
                  correo: usuario.correo,
                }}
              />
            </div>
          ),
        },
        {
          key: `editar-${usuario.id}`,

          content: (
            <div className="flex justify-center">
              <EditarIcon id={usuario.id} />
            </div>
          ),
        },
        {
          key: `borrar-${usuario.id}`,

          content: (
            <div className="flex justify-center">
              <BorrarIcon
                idUsuario={usuario.id}
                nombreUsuario={usuario.nombre}
              />
            </div>
          ),
        },
      ],
    })
  );

  if (userRows == null) return <div>Mi verga</div>;

  return (
    <div className="bg-white rounded-sm w-full px-12 py-6 text-sm">
      <DynamicTable
        head={TableHead}
        rows={tableRows}
        emptyView={
          <Spinner message="Cargando usuarios..." gap={6}></Spinner>
        }
        rowsPerPage={20}
      />
    </div>
  );
};

export default UsersTable;
