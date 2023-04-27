import EmojiFrequentIcon from '@atlaskit/icon/glyph/emoji/frequent';
import HipchatChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import { FC, useState, useContext, useEffect, useRef } from 'react';
import type { Accionable } from '../../views/mis-accionables/MisAccionables';
import ProgressBar from './ProgressBar';
import { format, parseISO } from 'date-fns';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import axios from 'axios';
import EditorErrorIcon from '@atlaskit/icon/glyph/editor/error';
import { FlagContext } from '../../contexts';
import { Tooltip } from 'react-tooltip';
import Button from '@atlaskit/button';

const URI = `${import.meta.env.VITE_APP_BACKEND_URI}/accionables`;

function calcularDiasFaltantes(fechaLimite: string): number {
  const fechaActual = new Date();
  const fechaLimiteDate = new Date(fechaLimite);
  const tiempoFaltante =
    fechaLimiteDate.getTime() - fechaActual.getTime();
  const diasFaltantes = Math.ceil(
    tiempoFaltante / (1000 * 60 * 60 * 24)
  );
  return diasFaltantes;
}

const formatDate = (date: string) => {
  return format(parseISO(date), 'dd/MM/yyyy');
};
interface BoxAccionableProps {
  accionable: Accionable;
  getAccionables: () => void;
}

const BoxAccionable: FC<BoxAccionableProps> = ({
  accionable,
  getAccionables,
}) => {
  const [isShowMoreOpen, setIsShowMoreOpen] =
    useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCompletedHovered, setIsCompletedHovered] =
    useState<boolean>(false);
  const { addFlag } = useContext(FlagContext);
  const buttonRef = useRef<HTMLDivElement>(null);

  const diasFaltantes = calcularDiasFaltantes(
    accionable.fecha_esperada
  );

  const handleComplete = async () => {
    try {
      await axios.post(
        `${URI}/solve/${accionable.key_jira}/${accionable.id}`
      );
      getAccionables();
      addFlag(
        'El accionable se ha marcado como completado exitosamente.',
        CheckCircleIcon,
        'success'
      );
    } catch (error) {
      console.log(error);
      addFlag(
        'Hubo un error al intentar marcar el accionable como completado. Intente de nuevo más tarde.',
        EditorErrorIcon,
        'error'
      );
    }
  };

  const handleClickOutside = (event: MouseEvent, elemento: any) => {
    if (
      elemento.current &&
      !elemento.current.contains(event.target)
    ) {
      setIsShowMoreOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', (evento: MouseEvent) => {
      handleClickOutside(evento, buttonRef);
    });
    return document.removeEventListener(
      'click',
      (evento: MouseEvent) => {
        handleClickOutside(evento, buttonRef);
      }
    );
  }, []);
  return (
    <div
      ref={buttonRef}
      className={`flex flex-col p-4 w-full gap-2 rounded bg-white border border-solid  shadow-sm ${
        isShowMoreOpen
          ? 'border-blue-500 shadow-blue-300'
          : 'border-gray'
      } items-start justify-center`}
    >
      <div className="flex items-center justify-between w-full">
        <p className="text-sm font-semibold text-textNormal">
          {accionable.descripcion}
        </p>
        <div className="flex items-center justify-end gap-[0.1rem]">
          {diasFaltantes && diasFaltantes > 0 ? (
            <>
              <EmojiFrequentIcon label="tiempo" size="small" />

              <p className="text-[0.65rem] text-textNormal">
                {diasFaltantes}d
              </p>
            </>
          ) : (
            <>
              <EmojiFrequentIcon
                label="tiempo"
                size="small"
                primaryColor="#f70000"
              />

              <p className="text-[0.65rem] text-danger">
                {diasFaltantes === 0
                  ? 'Vence hoy'
                  : `Vencido hace ${Math.abs(diasFaltantes)}d`}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="w-full flex justify-end items-center">
        <button
          type="button"
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          onClick={() =>
            setIsShowMoreOpen((prevState: boolean) => !prevState)
          }
          className={`flex items-center ${
            isHovered ? 'underline' : ''
          }`}
        >
          <span
            className={`flex ${
              isShowMoreOpen ? 'rotate-180' : 'rotate-0'
            }`}
          >
            <HipchatChevronDownIcon
              label="detalles"
              primaryColor={'#2684ff'}
            />
          </span>
          <p className={`text-xs text-[#2684ff]`}>
            {isShowMoreOpen ? 'Ocultar' : 'Ver'} detalles
          </p>
        </button>
      </div>

      {isShowMoreOpen && (
        <div className="flex flex-col gap-2 w-full mt-5">
          <div className="bg-gray-100 rounded p-3">
            <p className="text-xs font-semibold">
              Tiempo transcurrido
            </p>
            <div className="w-full flex justify-between items-center mt-1">
              <span className="text-[0.65rem] text-slate-600 font-medium p-[0.35rem] rounded w-fit">
                <p>Fecha de inicio</p>
                <p className="text-discovery font-medium">
                  {formatDate(accionable.createdAt)}
                </p>
              </span>
              <span className="text-[0.65rem] text-slate-600 font-medium p-[0.35rem] rounded w-fit text-right">
                <p>Fecha límite</p>
                <p className="text-discovery font-medium">
                  {formatDate(accionable.fecha_esperada)}
                </p>
              </span>
            </div>
            <ProgressBar
              createdAt={accionable.createdAt}
              fechaLimite={accionable.fecha_esperada}
            />
          </div>
          <a
            data-tooltip-id="anon-tooltip"
            data-tooltip-content={
              'Al marcar el accionable como completado, se eliminará de la lista de accionables.'
            }
            className="w-full flex items-center justify-center"
            onMouseEnter={() => setIsCompletedHovered(true)}
            onMouseLeave={() => setIsCompletedHovered(false)}
          >
            <button
              type="button"
              className={`flex items-center text-xs gap-2 mt-3 p-2 rounded ${
                isCompletedHovered ? 'text-green' : 'text-slate-600'
              }`}
              onClick={handleComplete}
            >
              <span
                className={`rounded-full border-2 flex items-center justify-center ${
                  isCompletedHovered
                    ? 'border-green'
                    : 'border-gray-500'
                }`}
              >
                <EditorDoneIcon
                  label="marcar como completado"
                  size="small"
                  primaryColor={`${
                    isCompletedHovered ? 'green' : '#fff'
                  }`}
                />
              </span>
              Marcar como completado
            </button>
          </a>
          <Tooltip
            id="anon-tooltip"
            place="bottom"
            className="text-xs bg-deepBlue z-20"
          />
        </div>
      )}
    </div>
  );
};

export default BoxAccionable;
