import type { TagColor } from '@atlaskit/tag';
import axios from 'axios';
import { FC, useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  DesignTemplate,
  PanelRetros,
  ResponderRetro,
  Respuestas,
} from '../../components';
import { userDataContext } from '../../contexts';
import BotonGestionarRetro from './BotonGestionarRetro';

const URI = `${import.meta.env.VITE_APP_BACKEND_URI}/retrospectivas`;

export interface Retrospectiva {
  id: number;
  completada: boolean;
  num_respuestas: number;
  en_curso: boolean;
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
  const [retrosFinalizadas, setRetrosFinalizadas] = useState<
    Array<Retrospectiva>
  >([]);
  const [tryFetch, setTryFetch] = useState(false);

  const getTags = async (id: number) => {
    const response = await axios.get(`${URI}/tags/${id}`);
    return response.data;
  };

  const getRetrospectivas = async () => {
    const response = await axios.get(`${URI}/panelRetrosByUser`, {
      params: { id_usuario: user?.id_usuario || -1 },
    });

    const pendientes = response.data.filter(
      (
        retro: Retrospectiva & {
          asignada: boolean;
          en_curso: boolean;
        }
      ) => !retro.completada && retro.asignada && retro.en_curso
    );

    pendientes.sort(
      (retroA: Retrospectiva, retroB: Retrospectiva) => {
        const fechaInicioA = new Date(retroA.fecha_inicio);
        const fechaInicioB = new Date(retroB.fecha_inicio);
        return fechaInicioA.getTime() - fechaInicioB.getTime();
      }
    );

    const completadas = response.data.filter(
      (
        retro: Retrospectiva & {
          asignada: boolean;
          en_curso: boolean;
        }
      ) => retro.completada && retro.asignada && retro.en_curso
    );
    const otras = response.data.filter(
      (
        retro: Retrospectiva & {
          completada: boolean;
          asignada: boolean;
          en_curso: boolean;
        }
      ) => !retro.asignada && retro.en_curso
    );

    const finalizadas = response.data.filter(
      (
        retro: Retrospectiva & {
          en_curso: boolean;
        }
      ) => !retro.en_curso
    );

    for (const retro of [
      ...pendientes,
      ...completadas,
      ...otras,
      ...finalizadas,
    ]) {
      const tags = await getTags(retro.id);
      retro.tags = tags;
    }

    setRetroPendientes(pendientes);
    setRetrosCompletadas(completadas);
    setOtrasRetros(otras);
    setRetrosFinalizadas(finalizadas);
    setTryFetch(true);
  };

  useEffect(() => {
    getRetrospectivas();
  }, []);
  return (
    <DesignTemplate buttons={<BotonGestionarRetro/>}>
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
              retrosFinalizadas={retrosFinalizadas}
              getRetrospectivas={getRetrospectivas}
            />
          }
        />
        <Route
          path="/responder/:retroId/*"
          element={
            <ResponderRetro retroPendientes={retroPendientes} />
          }
        />
        <Route
          path="/respuestas/:retroId/"
          element={<Respuestas />}
        />
      </Routes>
    </DesignTemplate>
  );
};

export default MisRetrospectivas;
