import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import EditorErrorIcon from '@atlaskit/icon/glyph/editor/error';
import Tag, { type TagColor } from '@atlaskit/tag';
import axios from 'axios';
import { FC, FormEvent, useContext, useState } from 'react';
import { FlagContext } from '../../../contexts';
import DropdownColores from '../DropdownColores';
import { getEtiquetasContext } from '../local-contexts';
import Button from '@atlaskit/button';

const URI = `${import.meta.env.VITE_APP_BACKEND_URI}/etiquetas/`;

interface RegistrarEtiquetaProps {
  show: boolean;
  onClose: () => void;
}

const labelStyle =
  "after:content-['*'] after:text-[#ae2a19] text-xs font-semibold text-label";

const ModalRegistrarEtiqueta: FC<RegistrarEtiquetaProps> = ({
  show,
  onClose,
}) => {
  const { addFlag } = useContext(FlagContext);
  const { getEtiquetas } = useContext(getEtiquetasContext);
  const [nombre, setNombre] = useState('Etiqueta');
  const [color, setColor] = useState<TagColor>('standard');

  const handleColorSeleccionado = (color: TagColor) => {
    setColor(color);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      axios
        .post(URI, {
          etiqueta: nombre,
          color: color,
        })
        .then(() => {
          getEtiquetas();
          addFlag(
            '¡Excelente! La etiqueta se ha registrado correctamente.',
            CheckCircleIcon,
            'success'
          );
          onClose();
        });
    } catch (error) {
      if (error instanceof Error) {
        addFlag(
          '¡Oh no! Hubo un error al registrar la etiqueta. Por favor, inténtalo de nuevo más tarde o contacta soporte.',
          EditorErrorIcon,
          'error',
          error.toString()
        );
      } else {
        addFlag(
          '¡Oh no! Hubo un error al registrar la etiqueta. Por favor, inténtalo de nuevo más tarde o contacta soporte.',
          EditorErrorIcon,
          'error',
          'Error desconocido'
        );
      }
    }
    setColor('standard');
    setNombre('Etiqueta');
  };

  const handleClose = () => {
    setNombre('Etiqueta');
    setColor('standard');
    onClose();
  };

  if (!show) {
    return null;
  }
  return (
    <>
      <div className="z-[1000] bg-blueRGBA fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center">
        <div className="p-10 bg-white rounded flex flex-col w-[40vw]">
          <div className="w-full flex flex-col items-center">
            <div className="w-full mb-1 flex items-center justify-between font-semibold text-base">
              <h4>Registrar nueva etiqueta</h4>
              <div
                className="flex items-center justify-center cursor-pointer p-1"
                onClick={handleClose}
              >
                <CrossIcon label="cerrar modal" size="small" />
              </div>
            </div>
            <p className="w-full text-xs text-[#44546f] mb-5">
              La nueva etiqueta podrá ser asignada a un usuario para
              agilizar el proceso de asignación de retrospectivas.
            </p>
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
                  name="nombre"
                  className="h-8 border-2 border-gray rounded-sm p-2 focus:outline-gray-400 hover:bg-gray-100 text-xs"
                  autoComplete="off"
                  id="nombre"
                  type="text"
                  placeholder='Ej: "Front-End"'
                  pattern="^[a-zA-Z0-9!@#$%^&*()_+\-/]{1,15}$"
                  title="El nombre de la etiqueta debe tener entre 1 y 15 caracteres alfanuméricos"
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="color" className={labelStyle}>
                  Color
                </label>
                <DropdownColores
                  onColorSeleccionadoChange={handleColorSeleccionado}
                />
              </div>
            </form>
            <span className="flex flex-col gap-2 my-2">
              <p className="w-full text-center text-xs">
                Previsualización de la etiqueta
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
            <Button onClick={handleClose}>Cancelar</Button>
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
};

export default ModalRegistrarEtiqueta;
