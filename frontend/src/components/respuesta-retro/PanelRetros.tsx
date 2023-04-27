import { FC, useEffect } from 'react';
import type { Retrospectiva } from '../../views/mis-retrospectivas/MisRetrospectivas';
import Spinner from '../design-template/spinner/Spinner';
import RetrospectivaGeneral from './reusable/RetrospectivaGeneral';

interface PanelRetrosProps {
  tryFetch: boolean;
  retroPendientes: Retrospectiva[];
  retrosCompletadas: Retrospectiva[];
  otrasRetros: Retrospectiva[];
  retrosFinalizadas: Retrospectiva[];
  getRetrospectivas: () => void;
}

const divGroupsStyle =
  'flex flex-col gap-2 lg:gap-5 bg-[#ffffff] py-4 px-4 lg:py-5 lg:px-5 rounded-sm shadow-sm overflow-y-auto min-w-auto min-h-auto lg:max-h-[40rem] lg:min-w-[28rem] min-h-[30vh]';

const cardsTitles =
  'text-sm font-semibold text-information lg:text-start text-center';

const PanelRetros: FC<PanelRetrosProps> = ({
  tryFetch,
  retroPendientes,
  retrosCompletadas,
  otrasRetros,
  retrosFinalizadas,
  getRetrospectivas,
}) => {
  useEffect(() => {
    getRetrospectivas();
  }, [
    retroPendientes,
    retrosCompletadas,
    otrasRetros,
    retrosFinalizadas,
  ]);

  if (!tryFetch)
    return <Spinner message="Cargando retrospectivas..." gap={6} />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5 pb-2 lg:pb-5">
      <div className={divGroupsStyle}>
        <h2 className={cardsTitles}>
          Mis retrospectivas pendientes de responder
        </h2>
        <div className="flex flex-col gap-5">
          {retroPendientes.length > 0 ? (
            retroPendientes.map((retrospectiva: Retrospectiva) => {
              return (
                <RetrospectivaGeneral
                  key={retrospectiva.id}
                  idRetrospectiva={retrospectiva.id || -1}
                  titulo={retrospectiva.titulo || ''}
                  descripcion={retrospectiva.descripcion || ''}
                  fechaInicio={retrospectiva.fecha_inicio || ''}
                  tags={retrospectiva.tags}
                  respuestas={retrospectiva.num_respuestas}
                />
              );
            })
          ) : (
            <p className="text-xs text-discovery">
              No tienes retrospectivas pendientes para mostrar.
            </p>
          )}
        </div>
      </div>
      <div className={divGroupsStyle}>
        <h2 className={cardsTitles}>
          Mis retrospectivas recientemente completadas
        </h2>
        <div className="flex flex-col gap-2 lg:gap-5">
          {retrosCompletadas.length > 0 ? (
            retrosCompletadas.map((retrospectiva: Retrospectiva) => {
              return (
                <RetrospectivaGeneral
                  key={retrospectiva.id}
                  idRetrospectiva={retrospectiva.id || -1}
                  titulo={retrospectiva.titulo || ''}
                  descripcion={retrospectiva.descripcion || ''}
                  fechaInicio={retrospectiva.fecha_inicio || ''}
                  clickable={false}
                  completada={true}
                  tags={retrospectiva.tags}
                  respuestas={retrospectiva.num_respuestas}
                />
              );
            })
          ) : (
            <p className="text-xs text-discovery">
              No tienes retrospectivas recientemente completadas para
              mostrar.
            </p>
          )}
        </div>
      </div>
      <div className={divGroupsStyle}>
        <h2 className={cardsTitles}>
          Otras retrospectivas en curso del equipo
        </h2>
        <div className="flex flex-col gap-2 lg:gap-5">
          {otrasRetros.length > 0 ? (
            otrasRetros.map((retrospectiva: Retrospectiva) => {
              return (
                <RetrospectivaGeneral
                  key={retrospectiva.id}
                  idRetrospectiva={retrospectiva.id || -1}
                  titulo={retrospectiva.titulo || ''}
                  descripcion={retrospectiva.descripcion || ''}
                  fechaInicio={retrospectiva.fecha_inicio || ''}
                  clickable={false}
                  assigned={false}
                  tags={retrospectiva.tags}
                  respuestas={retrospectiva.num_respuestas}
                />
              );
            })
          ) : (
            <p className="text-xs text-discovery">
              No hay otras retrospectivas del equipo para mostrar.
            </p>
          )}
        </div>
      </div>
      <div className={divGroupsStyle}>
        <h2 className={cardsTitles}>Retrospectivas finalizadas</h2>
        <div className="flex flex-col gap-2 lg:gap-5">
          {retrosFinalizadas.length > 0 ? (
            retrosFinalizadas.map((retrospectiva: Retrospectiva) => {
              return (
                <RetrospectivaGeneral
                  key={retrospectiva.id}
                  idRetrospectiva={retrospectiva.id || -1}
                  titulo={retrospectiva.titulo || ''}
                  descripcion={retrospectiva.descripcion || ''}
                  fechaFin={retrospectiva.fecha_fin || ''}
                  fechaInicio={retrospectiva.fecha_inicio || ''}
                  clickable={false}
                  assigned={false}
                  enCurso={false}
                  tags={retrospectiva.tags}
                />
              );
            })
          ) : (
            <p className="text-xs text-discovery">
              No hay retrospectivas finalizadas para mostrar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelRetros;
