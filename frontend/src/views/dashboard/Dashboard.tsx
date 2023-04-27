import { FC, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DesignTemplate from '../../components/design-template/DesignTemplate';
import { userDataContext } from '../../contexts';
import BannerRetro from '../../components/respuesta-retro/reusable/BannerRetro';
import type { Retrospectiva } from '../mis-retrospectivas/MisRetrospectivas';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import axios from 'axios';
import Button from '@atlaskit/button';
import CarouselDash from './CarouselDash';
import { format, parseISO } from 'date-fns';
import { BotonReporte, Spinner } from '../../components';
import AstronautHappy from '@/assets/astronaut-happy.webp';

const URI = `${import.meta.env.VITE_APP_BACKEND_URI}/retrospectivas`;

const Dashboard: FC = ({}) => {
  const { user } = useContext(userDataContext);
  const navigate = useNavigate();
  const [tryFetch, setTryFetch] = useState(false);
  const { retroId } = useParams();
  const [retroPendientes, setRetroPendientes] = useState<
    Array<Retrospectiva>
  >([]);

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
  }, []);

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
          <div className="grid grid-rows-3 bg-[#ffffff] p-6 rounded-sm gap-5 shadow-sm h-[50%]">
            <h2 className="font-semibold w-full">Mis Accionables</h2>
            <div className="row-start-2 row-span-5 gap-5 w-full px-2">
              <div> </div>
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
