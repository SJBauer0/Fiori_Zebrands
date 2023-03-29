import type { TagColor } from '@atlaskit/tag';
import axios from 'axios';
import { FC, useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  DesignTemplate,
  PanelRetros,
  ResponderRetro,
} from '../../components';
import { userDataContext } from '../../contexts';

const URI = 'http://localhost:8000/retrospectivas';

export interface Retrospectiva {
  id: number;
  completada: boolean;
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  tags: {
    id: number;
    etiqueta: string;
    id_color: number;
    color: TagColor;
  }[];
}

interface MisRetrospectivasProps {}

const MisRetrospectivas: FC<MisRetrospectivasProps> = ({}) => {
  const { user } = useContext(userDataContext);
  const [retroPendientes, setRetroPendientes] = useState<
    Array<Retrospectiva>
  >([]);
  const [retrosCompletadas, setRetrosCompletadas] = useState<
    Array<Retrospectiva>
  >([]);
  const [otrasRetros, setOtrasRetros] = useState<
    Array<Retrospectiva>
  >([]);
  const [tryFetch, setTryFetch] = useState(false);

  const getTags = async (id: number) => {
    const response = await axios.get(`${URI}/tags/${id}`);
    return response.data;
  };

  const getRetrospectivas = async () => {
    const response = await axios.get(`${URI}/panelRetrosByUser`, {
      params: { id_usuario: user?.id || -1 },
    });

    const pendientes = response.data.filter(
      (
        retro: Retrospectiva & {
          asignada: boolean;
        }
      ) => !retro.completada && retro.asignada
    );
    const completadas = response.data.filter(
      (
        retro: Retrospectiva & {
          asignada: boolean;
        }
      ) => retro.completada && retro.asignada
    );
    const otras = response.data.filter(
      (
        retro: Retrospectiva & {
          completada: boolean;
          asignada: boolean;
        }
      ) => !retro.asignada
    );

    for (const retro of [...pendientes, ...completadas, ...otras]) {
      const tags = await getTags(retro.id);
      retro.tags = tags;
    }

    setRetroPendientes(pendientes);
    setRetrosCompletadas(completadas);
    setOtrasRetros(otras);
    setTryFetch(true);
  };

  useEffect(() => {
    getRetrospectivas();
  }, []);
  return (
    <DesignTemplate>
      <Routes>
        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route
          path="/"
          element={
            <PanelRetros
              tryFetch={tryFetch}
              retroPendientes={retroPendientes}
              retrosCompletadas={retrosCompletadas}
              otrasRetros={otrasRetros}
            />
          }
        />
        <Route
          path="/responder/:retroId/*"
          element={
            <ResponderRetro retroPendientes={retroPendientes} />
          }
        />
      </Routes>
    </DesignTemplate>
  );
};

export default MisRetrospectivas;
