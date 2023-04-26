import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import { FC, useCallback, useState } from 'react';
import DesignTemplate from '../../components/design-template/DesignTemplate';
// import ModalNuevoAccionable from '../../components/accionables/modals/ModalNuevoAccionable2';
import ModalNuevoAccionable from '../../components/accionables/modals/ModalNuevoAccionable2';
import BoxAccionable from '../../components/accionables/BoxAccionable';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import axios from 'axios';
import { useEffect } from 'react';

interface MisAccionablesProps {
  setIsNewAccionableOpen: (value: boolean) => void;
  agregarAccionable: (accionable: any) => void;
}

const MisAccionables: FC<MisAccionablesProps> = ({}) => {
  const [isNewAccionableOpen, setIsNewAccionableOpen] =
    useState<boolean>(false);
  const [accionables, setAccionables] = useState<any[]>([]);
  const [accionablesPersonales, setAccionablesPersonales] = useState<
    any[]
  >([]);

  const getAccionables = async () => {
    try {
      // const response = await axios.get(
      //   `http://localhost:8000/accionables/24`
      // );
      // setAccionablesPersonales(response.data);
    } catch (error) {
      console.error('Error al obtener los accionables:', error);
    }
  };

  useEffect(() => {
    getAccionables();
  }, []);

  const agregarAccionable = (accionable: any) => {
    const hoy = new Date();
    const fechaAccionable = new Date(accionable.fecha);
    const diasTranscurridos = Math.floor(
      (hoy.getTime() - fechaAccionable.getTime()) / (1000 * 3600 * 24)
    );
    let prioridad = 'baja';
    if (diasTranscurridos >= 14 && diasTranscurridos < 21) {
      prioridad = 'media';
    } else if (diasTranscurridos >= 21) {
      prioridad = 'alta';
    }
    setAccionables((prevAccionables) => [
      ...prevAccionables,
      {
        ...accionable,
        fecha: new Date().toLocaleDateString(),
        prioridad,
      },
    ]);
  };

  const accionablesPrioridadBaja = accionables.filter(
    (accionable) => accionable.prioridad === 'baja'
  );
  const accionablesPrioridadMedia = accionables.filter(
    (accionable) => accionable.prioridad === 'media'
  );
  const accionablesPrioridadAlta = accionables.filter(
    (accionable) => accionable.prioridad === 'alta'
  );

  return (
    <>
      <DesignTemplate
        buttons={
          <Button
            appearance="primary"
            iconBefore={<AddIcon label="agregar accionable" />}
            onClick={() => setIsNewAccionableOpen(true)}
          >
            Agregar accionable
          </Button>
        }
      >
        <div className="grid grid-cols-3 gap-5 pb-5">
          <div className="flex flex-col gap-5 bg-[#ffffff] py-5 px-5 rounded-sm shadow-sm overflow-y-auto max-h-[40rem] min-w-[28rem]">
            <div className="flex items-center">
              <ErrorIcon
                label="error"
                size="medium"
                primaryColor="#DE350B"
              />
              <p className="font-semibold flex flex-row text-s text-danger ml-2">
                Prioridad Alta
              </p>
            </div>
            {accionablesPrioridadAlta.map((accionable) => (
              <BoxAccionable
                key={accionable.id}
                accionable={accionable.accionable}
                id={accionable.id}
                fecha={accionable.fecha}
              />
            ))}
          </div>

          <div className="flex flex-col gap-5 bg-[#ffffff] py-5 px-5 rounded-sm shadow-sm overflow-y-auto max-h-[40rem] min-w-[28rem]">
            <div className="flex items-center">
              <WarningIcon
                size="medium"
                label="Prioridad media"
                primaryColor="#CD742D"
              />
              <p className="font-semibold flex flex-row text-s text-mediumDanger ml-2">
                Prioridad Media
              </p>
            </div>
            {accionablesPrioridadMedia.map((accionable) => (
              <BoxAccionable
                key={accionable.id}
                accionable={accionable.accionable}
                id={accionable.id}
                fecha={accionable.fecha}
              />
            ))}
          </div>

          <div className="flex flex-col gap-5 bg-[#ffffff] py-5 px-5 rounded-sm shadow-sm overflow-y-auto max-h-[40rem] min-w-[28rem]">
            <div className="flex items-center">
              <CheckCircleIcon
                size="medium"
                label="Prioridad media"
                primaryColor="#4E9E70"
              />
              <p className="font-semibold flex flex-row text-s text-green ml-2">
                Prioridad Baja
              </p>
            </div>
            {accionablesPersonales.map((accionable) => (
              <BoxAccionable
                accionable={accionable.accionable}
                id={accionable.id}
                fecha={accionable.fecha}
              />
            ))}
          </div>
        </div>
      </DesignTemplate>

      {isNewAccionableOpen && (
        <ModalNuevoAccionable
          // getAccionables={getAccionables}
          setIsModalOpen={setIsNewAccionableOpen}
          // agregarAccionable={agregarAccionable}
        />
      )}
    </>
  );
};

export default MisAccionables;
