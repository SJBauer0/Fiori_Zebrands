import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import EditorErrorIcon from '@atlaskit/icon/glyph/editor/error';
import Tag, { type TagColor } from '@atlaskit/tag';
import axios from 'axios';
import {
  FC,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { FlagContext } from '../../../contexts';
import DropdownColores from '../DropdownColores';
import { getEtiquetasContext } from '../local-contexts';
import Button from '@atlaskit/button';

const URI = `${import.meta.env.VITE_APP_BACKEND_URI}/etiquetas/`;

const labelStyle =
  "after:content-['*'] after:text-[#ae2a19] text-xs font-semibold text-label";

interface Etiqueta {
  id: number;
  nombre: string;
  id_color: number;
  color: TagColor;
}
interface ModalEditarEtiquetaProps {
  show: boolean;
  onClose: () => void;
  info: Etiqueta;
}

const ModalEditarEtiqueta: FC<ModalEditarEtiquetaProps> = ({
  show,
  onClose,
  info,
}) => {
  const { addFlag } = useContext(FlagContext);
  const { getEtiquetas } = useContext(getEtiquetasContext);
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState<TagColor>('standard');
  const [etiqueta, setEtiqueta] = useState<Etiqueta>({} as Etiqueta);

  const handleColorSeleccionado = (color: TagColor) => {
    setColor(color);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const id = info.id;
      await axios.put(`${URI}${id}`, {
        etiqueta: nombre,
        color: color,
      });
      getEtiquetas();
      addFlag(
        '¡Bien! La etiqueta ha sido actualizada exitosamente.',
        CheckCircleIcon,
        'success'
      );
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        addFlag(
          '¡Oh no! Hubo un error al actualizar la etiqueta. Inténtalo de nuevo más tarde o contacta soporte.',
          EditorErrorIcon,
          'warning',
          error.toString()
        );
      } else {
        console.log(error);
        addFlag(
          '¡Oh no! Hubo un error al actualizar la etiqueta. Inténtalo de nuevo más tarde o contacta soporte.',
          EditorErrorIcon,
          'warning',
          'Error desconocido'
        );
      }
    }
  };

  const getEtiqueta = (id: number) => {
    const res = axios.get(`${URI}${id}`);
    res.then((res) => {
      setEtiqueta(res.data.shift());
      setColor(etiqueta.color);
      setNombre(etiqueta.nombre);
    });
  };

  useEffect(() => {
    getEtiqueta(info.id);
    show && document.body.classList.add('modal-open');

    return () => {
      show && document.body.classList.remove('modal-open');
    };
  }, [show]);

  if (!show) {
    return null;
  } else {
    return (
      <>
        <div className="z-[1000] bg-blueRGBA fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center">
          <div className="p-10 bg-white rounded flex flex-col w-[40vw]">
            <div className="w-full flex flex-col items-center">
              <div className="w-full mb-1 flex items-center justify-between font-semibold text-base">
                <h4>Modificar etiqueta</h4>
                <div
                  className="flex items-center justify-center cursor-pointer p-1"
                  onClick={onClose}
                >
                  <CrossIcon label="cerrar modal" size="small" />
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-7 mt-2">
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-center justify-center gap-6"
                id="RegistrarEtiquetaForm"
              >
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="nombre" className={labelStyle}>
                    Nombre
                  </label>
                  <input
                    required
                    className="h-8 border-2 border-gray rounded-sm p-2 focus:outline-gray-400 hover:bg-gray-100 text-xs"
                    autoComplete="off"
                    name="nombre"
                    id="nombre"
                    type="text"
                    defaultValue={etiqueta.nombre}
                    pattern="^[a-zA-Z0-9!@#$%^&*()_+\/\-\sáéíóúÁÉÍÓÚñÑ]{1,15}$"
                    title="El nombre de la etiqueta debe tener entre 1 y 15 caracteres alfanuméricos"
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="color" className={labelStyle}>
                    Color
                  </label>
                  <DropdownColores
                    onColorSeleccionadoChange={
                      handleColorSeleccionado
                    }
                    colorActual={etiqueta.color}
                  />
                </div>
              </form>
              <span className="flex flex-col gap-2 my-2">
                <p className="w-full text-center text-xs">
                  Previsualización de la nueva etiqueta
                </p>
                <div className="flex justify-center" id="tag">
                  <Tag
                    text={nombre}
                    color={color}
                    isRemovable={false}
                    appearance="rounded"
                  />
                </div>
              </span>
            </div>
            <div
              className="flex items-center justify-end
            w-full gap-10 lg:flex-row flex-col mt-9"
            >
              <Button onClick={onClose}>Cancelar</Button>
              <Button
                appearance="primary"
                type="submit"
                form="RegistrarEtiquetaForm"
              >
                Registrar etiqueta
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default ModalEditarEtiqueta;
