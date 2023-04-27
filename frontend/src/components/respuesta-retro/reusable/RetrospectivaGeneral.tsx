import CheckIcon from '@atlaskit/icon/glyph/check';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import FlagFilledIcon from '@atlaskit/icon/glyph/flag-filled';
import PdfIcon from '@atlaskit/icon/glyph/pdf';
import { SimpleTag as Tag, TagColor } from '@atlaskit/tag';
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@atlaskit/icon/glyph/check-circle-outline';

interface RetrospectivaGeneralProps {
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin?: string;
  idRetrospectiva: number;
  enCurso?: boolean;
  clickable?: boolean;
  completada?: boolean;
  assigned?: boolean;
  tags: {
    id: number;
    etiqueta: string;
    id_color: number;
    color: TagColor;
  }[];
  respuestas?: number;
  noIcon?: boolean;
}

const RetrospectivaGeneral: FC<RetrospectivaGeneralProps> = ({
  titulo,
  descripcion,
  fechaInicio,
  fechaFin,
  idRetrospectiva,
  enCurso = true,
  clickable = true,
  completada = false,
  tags,
  assigned = true,
  respuestas = 0,
  noIcon = false,
}) => {
  const navigate = useNavigate();
  const [isInResponder, setIsInResponder] = useState<boolean>(false);
  const [fechaInicioFormat, setFechaInicioFormat] =
    useState<string>('');
  const [fechaFinFormat, setFechaFinFormat] = useState<string>('');
  const location = useLocation().pathname;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1)
      .toString()
      .padStart(2, '0');
    const year = date.getUTCFullYear().toString();

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (
      location.includes('responder') ||
      location.includes('respuestas')
    ) {
      setIsInResponder(true);
    }
  }, []);

  const handleOnClick = () => {
    if (clickable && !isInResponder) {
      navigate(`/mis-retrospectivas/responder/${idRetrospectiva}`);
    }
    if (!clickable && !isInResponder) {
      navigate(`/mis-retrospectivas/respuestas/${idRetrospectiva}`);
    }
  };

  useEffect(() => {
    setFechaInicioFormat(formatDate(fechaInicio));
  }, [fechaInicio]);

  useEffect(() => {
    if (fechaFin) {
      setFechaFinFormat(formatDate(fechaFin));
    }
  }, [fechaFin]);

  return (
    <div
      className={`flex ${
        !isInResponder ? 'cursor-pointer' : 'cursor-default'
      }`}
      onClick={handleOnClick}
    >
      <div
        className={`flex flex-col px-5 py-3 w-full gap-1 rounded bg-white ${
          !isInResponder
            ? 'hover:bg-[#fafbfc] border border-solid border-gray'
            : 'shadow-sm'
        }`}
      >
        <div className="flex w-full flex-col lg:flex-row lg:justify-between">
          <div className="gap-3 flex flex-col lg:flex-row lg:items-center">
            {!noIcon &&
              (completada ? (
                <CheckIcon
                  label="retrospectiva-completada"
                  primaryColor="#12ab17"
                />
              ) : assigned ? (
                <FlagFilledIcon
                  label="retrospectiva-pendiente"
                  primaryColor="#8270DB"
                />
              ) : !enCurso ? (
                <CheckCircleOutlineIcon
                  label="finalizar retrospectiva"
                  primaryColor="#0055CC"
                />
              ) : (
                <PdfIcon
                  label="otra retrospectiva"
                  primaryColor="#709ddb"
                />
              ))}
            <h3 className="font-bold lg:text-sm text-justify">
              {titulo}
            </h3>
          </div>
          <div
            className={`${
              tags.length > 3 ? 'grid grid-cols-2' : 'flex flex-row'
            } text-right`}
          >
            {tags &&
              tags.map(
                (tag: {
                  id: number;
                  etiqueta: string;
                  color: TagColor;
                }) => (
                  <div key={tag.id} id="tag">
                    <Tag
                      text={tag.etiqueta}
                      appearance="rounded"
                      color={tag.color}
                    />
                  </div>
                )
              )}
          </div>
        </div>
        <span className="w-full flex justify-between">
          <p className="text-xs text-discovery font-medium mt-1">
            Respuestas registradas: {respuestas ? respuestas : 0}
          </p>
        </span>
        {descripcion && (
          <div className="flex text-[0.8rem] mt-2">
            <p>{descripcion}</p>
          </div>
        )}
        <div className="flex flex-col gap-2 lg:flex-row text-[0.7rem] lg:justify-between mt-3 lg:items-center">
          <p>Fecha de inicio: {fechaInicioFormat}</p>
          {fechaFinFormat && !enCurso && (
            <p>Fecha de fin: {fechaFinFormat}</p>
          )}
          {!isInResponder && (
            <div className="lg:visible invisible">
              <ChevronRightLargeIcon
                label="flecha"
                primaryColor="#1D7AFC "
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetrospectivaGeneral;
