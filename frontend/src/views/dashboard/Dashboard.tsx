import AstronautHappy from '@/assets/astronaut-happy.webp';
import Button from '@atlaskit/button';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import HipchatMediaAttachmentCountIcon from '@atlaskit/icon/glyph/hipchat/media-attachment-count';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { FC, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BotonReporte, Spinner } from '../../components';
import DesignTemplate from '../../components/design-template/DesignTemplate';
import BannerRetro from '../../components/respuesta-retro/reusable/BannerRetro';
import { userDataContext } from '../../contexts';
import { Accionable } from '../mis-accionables/MisAccionables';
import type { Retrospectiva } from '../mis-retrospectivas/MisRetrospectivas';
import CarouselDash from './CarouselDash';

const URI = `${import.meta.env.VITE_APP_BACKEND_URI}/retrospectivas`;
const URIA = `${import.meta.env.VITE_APP_BACKEND_URI}/accionables`;

const Dashboard: FC = ({}) => {
  const { user } = useContext(userDataContext);
  const navigate = useNavigate();
  const [tryFetch, setTryFetch] = useState(false);
  const { retroId } = useParams();
  const [retroPendientes, setRetroPendientes] = useState<
    Array<Retrospectiva>
  >([]);

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
    getRetrospectivas();
  }, []);

  useEffect(() => {
    if (accionables.length > 0) {
      separarAccionables(accionables);
    }
  }, [accionables]);

  const formatDate = (date: string) => {
    return format(parseISO(date), 'dd/MM/yyyy');
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
    setTryFetch(true);
    setRetroPendientes(pendientes);
  };

  useEffect(() => {
    getRetrospectivas();
    getAccionables();
  }, []);

  useEffect(() => {
    if (accionables.length > 0) {
      separarAccionables(accionables);
    }
  }, [accionables]);

  if (!user) {
    navigate('/login');
  }

  if (!tryFetch)
    return (
      <div className="absolute top-0 left-0 w-full h-full">
        <Spinner
          height="100%"
          message="Cargando tu dashboard..."
          gap={6}
        />
      </div>
    );

  return (
    <DesignTemplate buttons={<BotonReporte />}>
      <div className="flex lg:flex-row flex-col gap-5">
        <div className="flex bg-[#ffffff] p-6 rounded-sm shadow-sm w-full md:w-6/12 flex-col">
          <h2 className="font-semibold">Métricas</h2>
          <CarouselDash />
        </div>
        <div className="flex flex-col gap-5 w-full md:w-6/12">
          <div className=" bg-[#ffffff] p-6 rounded-sm gap-8 shadow-sm h-[50%]">
            <h2 className="font-semibold w-full">Mis accionables</h2>
            <div className="row-start-2 row-span-2 gap-1 w-full py-3 flex flex-col justify-center items-center">
              <div className="flex flex-row gap-10">
                <div className="flex flex-col gap-5 bg-[#ffffff] p-5 rounded-sm shadow-sm overflow-y-auto h-auto">
                  <div className="flex flex-col gap-1 justify-center items-center w-full">
                    <ErrorIcon
                      label="error"
                      size="large"
                      primaryColor="#DE350B"
                    />
                    <p className="font-semibold text-center flex flex-row text-sm text-danger ml-2">
                      Prioridad alta
                    </p>
                    <p className="mt-4 font-medium">
                      {prioridadAlta.length}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-5 bg-[#ffffff] py-5 px-5 rounded-sm shadow-sm overflow-y-auto max-h-[40rem]">
                  <div className="flex flex-col gap-1 align-middle items-center w-full">
                    <WarningIcon
                      size="large"
                      label="Prioridad media"
                      primaryColor="#CD742D"
                    />
                    <p className="font-semibold text-center flex flex-row text-sm text-mediumDanger ml-2">
                      Prioridad media
                    </p>
                    <p className="mt-4 font-medium">
                      {prioridadMedia.length}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-5 bg-[#ffffff] py-5 px-5 rounded-sm shadow-sm overflow-y-auto max-h-[40rem]">
                  <div className="flex flex-col gap-1 align-middle items-center w-full">
                    <HipchatMediaAttachmentCountIcon
                      label="bajo"
                      size="large"
                      primaryColor="#22A06B"
                    />
                    <p className="font-semibold text-center flex flex-row text-sm text-green ml-2">
                      Prioridad baja
                    </p>
                    <p className="mt-4 font-medium">
                      {prioridadBaja.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end text-right">
              <Button
                appearance="link"
                className="scale-90"
                iconAfter={
                  <ArrowRightIcon
                    label="volver a mis accionables"
                    primaryColor="#1D7AFC"
                  />
                }
                onClick={() => navigate(`/mis-accionables`)}
              >
                Ir a mis accionables
              </Button>
            </div>
          </div>
          <div className="flex flex-col bg-[#ffffff] p-6 rounded-sm gap-5 shadow-sm h-[50%]">
            <div>
              <h2 className="font-semibold">
                Retrospectivas pendientes
              </h2>
            </div>
            <div className="gap-2 w-full flex flex-col overflow-y-auto h-[100%] px-2">
              {retroPendientes.map(
                (retro, i) =>
                  i < 2 &&
                  Number(retroId) !== retro.id && (
                    <BannerRetro
                      key={retro.id}
                      titulo={retro.titulo}
                      fechaInicio={formatDate(retro.fecha_inicio)}
                      tags={retro.tags}
                    />
                  )
              )}
              {retroPendientes.length > 2 && (
                <span className="text-xs text-gray-500">
                  {retroPendientes.length - 2 === 1 ? (
                    <p>Más 1 retrospectiva pendiente...</p>
                  ) : (
                    <p>
                      Más {retroPendientes.length - 2} retrospectivas
                      pendientes...
                    </p>
                  )}
                </span>
              )}
              {retroPendientes.length === 0 && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <img
                    alt=""
                    src={AstronautHappy}
                    className="w-[6.5rem] opacity-80"
                  />
                  <span className="text-[0.8rem] text-gray-500">
                    ¡Muy bien! No tienes retrospectivas pendientes por
                    el momento.
                  </span>
                </div>
              )}
            </div>
            <div className="w-full flex justify-end">
              <Button
                appearance="link"
                className="scale-90"
                iconAfter={
                  <ArrowRightIcon
                    label="ir a mis retrospectivas"
                    primaryColor="#1D7AFC"
                  />
                }
                onClick={() => navigate(`/mis-retrospectivas`)}
              >
                Ir a mis retrospectivas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DesignTemplate>
  );
};

export default Dashboard;
