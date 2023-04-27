import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import axios from 'axios';
import { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BoxAccionable,
  DesignTemplate,
  ModalNuevoAccionable,
} from '../../components';
import { userDataContext } from '../../contexts/';
import Team from '../../assets/medal.png';

const URI = `${import.meta.env.VITE_APP_BACKEND_URI}/accionables`;

interface MisAccionablesProps {
  setIsNewAccionableOpen: (value: boolean) => void;
  agregarAccionable: (accionable: any) => void;
}

export interface Accionable {
  id: number;
  descripcion: string;
  fecha_esperada: string;
  key_jira: string;
  createdAt: string;
}

const MisAccionables: FC<MisAccionablesProps> = ({}) => {
  const [toggleUpdate, setToggleUpdate] = useState<boolean>(false);
  const { user } = useContext(userDataContext);
  const [isNewAccionableOpen, setIsNewAccionableOpen] =
    useState<boolean>(false);

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
      const response = await axios.get(`${URI}/${user?.id_usuario}`);
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
    <>
      <DesignTemplate
        buttons={
          <Button
            appearance="primary"
            iconBefore={<AddIcon label="nuevo accionable" />}
            onClick={() => setIsNewAccionableOpen(true)}
          >
            Nuevo accionable
          </Button>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="w-full bg-[#ffffff] p-4 rounded-sm shadow-sm">
            <div className="lg:flex lg:flex-row flex flex-col w-full bg-purple-100 py-7 gap-10 items-center justify-center rounded-sm">
              <img src={Team} className="h-24" />
              <div className="flex gap-5 flex-col">
                <div>
                  <h3 className="font-bold w-full text-discovery">
                    Recuerda que los pequeños actos que se ejecutan,
                    son mejores que todos aquellos grandes que se
                    planean.
                  </h3>
                  <p className="text-xs mt-1">
                    Debes completar los accionables que te habías
                    propuesto, de esta forma podrás ver tu progreso y
                    el de tu equipo desde otra perspectiva.
                  </p>
                </div>
                <p className="text-xs">
                  Si lo deseas, puedes revisar directamente tu
                  progreso en Jira haciendo{' '}
                  <Link
                    className="text-blue-500 hover:text-blue-800"
                    to="https://zebrands.atlassian.net"
                    target="_blank"
                  >
                    click aquí.
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pb-3 w-full">
            <div className="flex flex-col gap-5 bg-[#ffffff] p-5 rounded-sm shadow-sm overflow-y-auto h-auto">
              <div className="flex items-center w-full">
                <ErrorIcon
                  label="error"
                  size="medium"
                  primaryColor="#DE350B"
                />
                <p className="font-semibold flex flex-row text-sm text-danger ml-2">
                  Prioridad Alta
                </p>
              </div>
              {prioridadAlta.length > 0 ? (
                prioridadAlta.map((accionable: Accionable) => (
                  <>
                    <BoxAccionable
                      key={accionable.id}
                      accionable={accionable}
                      getAccionables={getAccionables}
                    />
                  </>
                ))
              ) : (
                <p className="text-xs">
                  No tienes accionables en prioridad alta.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-5 bg-[#ffffff] py-5 px-5 rounded-sm shadow-sm overflow-y-auto max-h-[40rem]">
              <div className="flex items-center">
                <WarningIcon
                  size="medium"
                  label="Prioridad media"
                  primaryColor="#CD742D"
                />
                <p className="font-semibold flex flex-row text-sm text-mediumDanger ml-2">
                  Prioridad Media
                </p>
              </div>
              {prioridadMedia.length > 0 ? (
                prioridadMedia.map((accionable: Accionable) => (
                  <BoxAccionable
                    key={accionable.id}
                    accionable={accionable}
                    getAccionables={getAccionables}
                  />
                ))
              ) : (
                <p className="text-xs">
                  No tienes accionables en prioridad media.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-5 bg-[#ffffff] py-5 px-5 rounded-sm shadow-sm overflow-y-auto max-h-[40rem]">
              <div className="flex items-center">
                <CheckCircleIcon
                  size="medium"
                  label="Prioridad media"
                  primaryColor="#4E9E70"
                />
                <p className="font-semibold flex flex-row text-sm text-green ml-2">
                  Prioridad Baja
                </p>
              </div>
              {prioridadBaja.length > 0 ? (
                prioridadBaja.map((accionable: Accionable) => (
                  <BoxAccionable
                    key={accionable.id}
                    accionable={accionable}
                    getAccionables={getAccionables}
                  />
                ))
              ) : (
                <p className="text-xs">
                  No tienes accionables en prioridad baja.
                </p>
              )}
            </div>
          </div>
        </div>
      </DesignTemplate>

      {isNewAccionableOpen && (
        <ModalNuevoAccionable
          getAccionables={getAccionables}
          setIsModalOpen={setIsNewAccionableOpen}
        />
      )}
    </>
  );
};

export default MisAccionables;
