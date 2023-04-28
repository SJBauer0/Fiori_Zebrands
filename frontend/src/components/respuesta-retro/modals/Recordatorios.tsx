import Blanket from '@atlaskit/blanket';
import Button, { ButtonGroup } from '@atlaskit/button';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import HipchatMediaAttachmentCountIcon from '@atlaskit/icon/glyph/hipchat/media-attachment-count';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import axios from 'axios';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { questionsContext } from '../local-contexts';
import BannerRetro from '../reusable/BannerRetro';
import type { Retrospectiva } from '../../../views/mis-retrospectivas/MisRetrospectivas';
import { format, parseISO } from 'date-fns';
import { Accionable } from '../../../views/mis-accionables/MisAccionables';
import { userDataContext } from '../../../contexts';

const URIA = `${import.meta.env.VITE_APP_BACKEND_URI}/accionables`;

interface RecordatoriosProps {
  setIsOpen: (isOpen: boolean) => void;
  retroPendientes: Retrospectiva[];
}

const Recordatorios: FC<RecordatoriosProps> = ({
  setIsOpen,
  retroPendientes,
}) => {
  const { user } = useContext(userDataContext);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const navigate = useNavigate();
  const { retroId } = useParams();

  const { questions } = useContext(questionsContext);

  const formatDate = (date: string) => {
    return format(parseISO(date), 'dd/MM/yyyy');
  };

  const [accionables, setAccionables] = useState<Accionable[]>([]);
  const [prioridadBaja, setPrioridadBaja] = useState<Accionable[]>(
    []
  );
  const [prioridadMedia, setPrioridadMedia] = useState<Accionable[]>(
    []
  );
  const [prioridadAlta, setPrioridadAlta] = useState<Accionable[]>(
    []
  );

  const getAccionables = async () => {
    try {
      const response = await axios.get(`${URIA}/${user?.id_usuario}`);
      setAccionables(response.data);
    } catch (error) {
      console.error('Error al obtener los accionables', error);
    }
  };

  const separarAccionables = async (accionables: any) => {
    const prioridadBaja: Accionable[] = [];
    const prioridadMedia: Accionable[] = [];
    const prioridadAlta: Accionable[] = [];

    accionables.forEach((accionable: Accionable) => {
      const fecha_accionable = accionable.fecha_esperada;
      const fecha_actual = new Date();

      const date1 = new Date(fecha_accionable);
      const date2 = new Date(fecha_actual);

      const diferenciaTiempo = date1.getTime() - date2.getTime();
      const diferenciaDias = Math.floor(
        diferenciaTiempo / (1000 * 60 * 60 * 24)
      );

      if (diferenciaDias > 30) {
        prioridadBaja.push(accionable);
      } else if (diferenciaDias <= 30 && diferenciaDias > 7) {
        prioridadMedia.push(accionable);
      } else if (diferenciaDias <= 7) {
        prioridadAlta.push(accionable);
      }
    });

    setPrioridadBaja(prioridadBaja);
    setPrioridadMedia(prioridadMedia);
    setPrioridadAlta(prioridadAlta);
  };

  useEffect(() => {
    getAccionables();
  }, []);

  useEffect(() => {
    if (accionables.length > 0) {
      separarAccionables(accionables);
    }
  }, [accionables]);

  return (
    <Blanket isTinted={true}>
      <div className="flex w-screen h-screen items-center justify-center p-6">
        <div className="flex flex-col bg-white rounded p-6 lg:p-10 gap-4 h-fit">
          <div className="flex justify-between">
            <h3 className="font-bold">
              Algunos recordatorios antes de comenzar
            </h3>
            <div className="cursor-pointer" onClick={closeModal}>
              <EditorCloseIcon label="close" primaryColor="#44546F" />
            </div>
          </div>
          <div className="max-h-[25rem] overflow-y-auto px-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3">
                <h4 className="flex font-bold text-sm ">
                  Accionables
                </h4>
                <p className="text-xs max-w-xl">
                  Es importante atender los accionables con mayor
                  urgencia cuanto antes para evitar que se acumulen
                  en futuros Sprints.
                </p>
              </div>
              {accionables.length > 0 ? (
                <div className="flex flex-col gap-3 font-medium">
                  <div className="flex items-center">
                    <ErrorIcon
                      label="urgente"
                      primaryColor="#E34935"
                    />
                    <p className="flex flex-row text-xs text-danger">
                      Tienes {prioridadAlta.length}{' '}
                      {prioridadAlta.length === 1
                        ? 'accionable'
                        : 'accionables'}{' '}
                      en urgencia alta
                    </p>
                  </div>
                  <div className="flex flex-row items-center">
                    <WarningIcon
                      label="medio"
                      primaryColor="#D97008"
                    />
                    <p className="text-xs text-mediumDanger flex items-center">
                      Tienes {prioridadMedia.length}{' '}
                      {prioridadMedia.length === 1
                        ? 'accionable'
                        : 'accionables'}{' '}
                      en urgencia media
                    </p>
                  </div>
                  <div className="flex flex-row items-center">
                    <HipchatMediaAttachmentCountIcon
                      label="bajo"
                      primaryColor="#22A06B"
                    />
                    <p className="text-xs text-green">
                      Tienes {prioridadBaja.length}{' '}
                      {prioridadBaja.length === 1
                        ? 'accionable'
                        : 'accionables'}{' '}
                      en urgencia baja
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-discovery">
                  ¡Buen trabajo! No tienes ningún accionable
                  pendiente.
                </p>
              )}
              <div className="flex justify-end">
                <Link
                  to="/mis-accionables"
                  className="flex text-xs text-selectBold"
                >
                  Ir a mis accionables
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <h4 className="flex font-bold text-sm">
                Retrospectivas
              </h4>
              {retroPendientes.length - 1 > 0 ? (
                <>
                  <p className="text-xs max-w-xl mb-3">
                    Te recordamos que tienes las siguientes
                    retrospectivas pendientes de contestar, te
                    recomendamos atender las más antiguas primero.
                  </p>
                  <div className="flex flex-col gap-3 w-full">
                    {retroPendientes.map(
                      (retro) =>
                        Number(retroId) !== retro.id && (
                          <BannerRetro
                            key={retro.id}
                            titulo={retro.titulo}
                            fechaInicio={formatDate(
                              retro.fecha_inicio
                            )}
                            tags={retro.tags}
                          />
                        )
                    )}
                  </div>
                </>
              ) : (
                <p className="text-xs max-w-xl mb-3 text-discovery">
                  ¡Muy bien! No tienes más retrospectivas pendientes
                  de contestar.
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <Link to="/mis-retrospectivas">
              <Button
                appearance="subtle-link"
                className="flex !items-center !p-2 !text-sm gap-5"
              >
                Regresar al panel de retrospectivas
              </Button>
            </Link>
            <Button
              isDisabled={questions.length === 0}
              className="flex !items-center !p-2 !text-sm gap-5"
              appearance="primary"
              autoFocus
              onClick={() => {
                closeModal();
                navigate(
                  `/mis-retrospectivas/responder/${retroId}/preguntas/`,
                  { replace: true }
                );
              }}
            >
              Continuar con la retrospectiva
            </Button>
          </div>
        </div>
      </div>
    </Blanket>
  );
};

export default Recordatorios;
