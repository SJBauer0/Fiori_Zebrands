import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import type { Retrospectiva } from '../../views/mis-retrospectivas/MisRetrospectivas';
import RetrospectivaThumb from './reusable/RetrospectivaThumb';

const URI = 'http://localhost:8000/retrospectivas';

interface PanelGestionarRetroProps {}

const divCardsStyle =
  'flex flex-col gap-5 bg-[#ffffff] py-5 px-5 rounded-sm shadow-sm';

const PanelGestionarRetro: FC<PanelGestionarRetroProps> = ({}) => {
  const [retrosOngoing, setRetrosOngoing] = useState<
    Array<Retrospectiva>
  >([]);
  const [retrosFinished, setRetrosFinished] = useState<
    Array<Retrospectiva>
  >([]);

  const getTags = async (id: number) => {
    const response = await axios.get(`${URI}/tags/${id}`);
    return response.data;
  };

  const getRetrospectivas = async () => {
    const { data } = await axios.get(`${URI}/panelRetros`);

    const ongoing = data.filter(
      (
        retro: Retrospectiva & {
          en_curso: boolean;
        }
      ) => retro.en_curso
    );
    const finished = data.filter(
      (
        retro: Retrospectiva & {
          en_curso: boolean;
        }
      ) => !retro.en_curso
    );

    for (const retro of [...ongoing, ...finished]) {
      const tags = await getTags(retro.id);
      retro.tags = tags;
    }

    setRetrosOngoing(ongoing);
    setRetrosFinished(finished);
  };

  useEffect(() => {
    getRetrospectivas();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-5">
      <div className={divCardsStyle}>
        <h2 className="text-base font-bold text-information">
          Retrospectivas en curso
        </h2>
        {retrosOngoing.length > 0 ? (
          retrosOngoing.map((retrospectiva: Retrospectiva) => {
            return (
              <RetrospectivaThumb
                key={retrospectiva.id}
                idRetrospectiva={retrospectiva.id || -1}
                titulo={retrospectiva.titulo || ''}
                descripcion={retrospectiva.descripcion || ''}
                fechaInicio={retrospectiva.fecha_inicio || ''}
                respuestas={retrospectiva.num_respuestas}
                tags={retrospectiva.tags}
              />
            );
          })
        ) : (
          <p>No hay retrospectivas en curso</p>
        )}
      </div>
      <div className={divCardsStyle}>
        <h2 className="text-base font-bold text-information">
          Retrospectivas finalizadas
        </h2>
        {retrosFinished.length > 0 ? (
          retrosFinished.map((retrospectiva: Retrospectiva) => {
            return (
              <RetrospectivaThumb
                key={retrospectiva.id}
                idRetrospectiva={retrospectiva.id || -1}
                titulo={retrospectiva.titulo || ''}
                descripcion={retrospectiva.descripcion || ''}
                fechaInicio={retrospectiva.fecha_inicio || ''}
                fechaFin={retrospectiva.fecha_fin || ''}
                respuestas={retrospectiva.num_respuestas}
                tags={retrospectiva.tags}
                completada
              />
            );
          })
        ) : (
          <p>No hay retrospectivas finalizadas</p>
        )}
      </div>
    </div>
  );
};

export default PanelGestionarRetro;
