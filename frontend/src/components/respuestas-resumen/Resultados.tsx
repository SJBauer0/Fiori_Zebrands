import { ReactComponent as IncognitoSVG } from '@/assets/icons/incognito.svg';
import { FC, useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { BarChart, PieChart } from '../charts';
import type { OpcionesType } from './Respuestas';
interface ResultadosProps {
  id_tipo_pregunta: number;
  pregunta: string;
  opciones: OpcionesType[] | null;
  respuestas: {
    respuesta: string;
    id_pregunta: number;
    id_usuario: number;
    anonimo: boolean;
    nombre: string;
  }[];
}

interface DataType {
  status: string;
  total: number;
}
const Resultados: FC<ResultadosProps> = ({
  id_tipo_pregunta,
  pregunta,
  respuestas,
  opciones,
}) => {
  const [data, setData] = useState<DataType[]>([]);
  const handleDataType3 = (): DataType[] => {
    const opcionesData: DataType[] = opciones?.map((opcion) => {
      const valueRespuestas = respuestas.filter(
        (respuesta) => respuesta.respuesta === opcion.opcion_respuesta
      ).length;
      return {
        status: opcion.opcion_respuesta,
        total: valueRespuestas,
      };
    }) as DataType[];
    return opcionesData;
  };

  const [esAnonimo, setEsAnonimo] = useState<boolean>(false);
  const [isAnonReady, setIsAnonReady] = useState(false);
  const handleAnonimo = () => {
    const valueRespuestas = respuestas.filter(
      (respuesta) => !!respuesta.anonimo === true
    ).length;
    if (valueRespuestas > 0) {
      setEsAnonimo(true);
    }
    setIsAnonReady(true);
  };

  useEffect(() => {
    handleAnonimo();
  }, []);

  const handleDataType4 = (): DataType[] => {
    const opcionesData: DataType[] = [];

    for (let index = 1; index <= 5; index++) {
      const valueRespuestas = respuestas.filter(
        (respuesta) => Number(respuesta.respuesta) === index
      ).length;
      const total = (
        (valueRespuestas / respuestas?.length) *
        100
      ).toFixed(3);
      opcionesData.push({
        status: index.toString(),
        total: Number(total) || 0,
      });
    }

    return opcionesData;
  };

  useEffect(() => {
    if (id_tipo_pregunta === 3) {
      setData(handleDataType3);
    }
    if (id_tipo_pregunta === 4) {
      setData(handleDataType4);
    }
  }, [id_tipo_pregunta]);

  const Case = () => {
    switch (id_tipo_pregunta) {
      case 3:
        return (
          <div className="flex w-full h-[20rem] justify-center items-center">
            <PieChart data={data} />
          </div>
        );
      case 4:
        return (
          <div className="flex w-full h-[20rem] justify-center items-center">
            <BarChart data={data} />
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-3">
            {respuestas.map((respuesta) => (
              <div
                className="flex flex-col gap-1 border-2 border-gray rounded-sm p-4 overflow-x-auto"
                key={respuesta.id_usuario}
              >
                <p className="text-gray-600 font-medium text-[0.9rem]">
                  {!isAnonReady
                    ? 'Usuario'
                    : esAnonimo
                    ? 'Usuario anónimo'
                    : respuesta.nombre}
                </p>

                <p className="text-gray-700 text-[0.8rem] ">
                  {respuesta.respuesta}
                </p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col py-8 px-10 w-full h-full md:max-h-[50rem] overflow-y-auto gap-5 rounded bg-white shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-sm text-textNormal font-semibold">
            {pregunta}
          </h2>
          {esAnonimo && (
            <a
              data-tooltip-id="anon-tooltip"
              data-tooltip-content={
                'Un usuario ha respondido de forma anónima, por lo cual no se mostrarán los nombres de los usuarios.'
              }
            >
              <IncognitoSVG
                width={20}
                height={20}
                className="incognito-resumen"
              />
            </a>
          )}
        </div>
        <p className="text-xs">Respuestas: {respuestas.length}</p>
      </div>
      {respuestas.length > 0 ? (
        <Case />
      ) : (
        <p className="text-xs text-discovery">
          No hay respuestas registradas para esta pregunta.
        </p>
      )}
      <Tooltip
        id="anon-tooltip"
        className="text-xs bg-deepBlue max-w-sm"
      />
    </div>
  );
};

export default Resultados;
