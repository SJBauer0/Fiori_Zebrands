import axios from 'axios';
import { FC, FormEvent, useEffect, useState } from 'react';
import DropdownColores from '../DropdownColores';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Tag, { type TagColor } from '@atlaskit/tag';

const URI = 'http://localhost:8000/etiquetas/';

interface Etiqueta {
  id: number;
  nombre: string;
  id_color: number;
  color: TagColor;
}

interface Color {
  id: number;
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
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState<TagColor>('standard');
  const [etiqueta, setEtiqueta] = useState<Etiqueta>({} as Etiqueta);

  const handleClose = () => {
    onClose();
  };

  const handleColorSeleccionado = (color: TagColor) => {
    setColor(color);
  };

  const handleSubmit = (e: FormEvent) => {
    try {
      const id = info.id;
      axios
        .put(`${URI}${id}`, { etiqueta: nombre, color: color })
        .then(() => window.location.reload());
    } catch (error) {
      window.alert(error);
    }
    onClose();
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
          <div className="p-10 bg-white rounded-xl flex flex-col">
            <div className="w-full flex flex-col items-center">
              <div className="w-full text-xl font-bold mb-1 flex items-center justify-between">
                <h4>Modificar Etiqueta</h4>
                <button onClick={handleClose}>
                  <CrossIcon label="Cross Icon" />
                </button>
              </div>
              <div className="w-full text-sm text-[#44546f] mb-5">
                Modifica los datos de una etiqueta en el sistema.
              </div>
            </div>
            <div className="w-full flex flex-col justify center">
              <p className="font-bold text-left mb-4">
                Detalles de etiqueta
              </p>
              <div className="flex justify-center" id="tag">
                <Tag
                  text={nombre}
                  color={color}
                  isRemovable={false}
                  appearance="rounded"
                />
              </div>
              <form
                onSubmit={handleSubmit}
                action=""
                method="post"
                className="flex flex-col mt-4"
                id="EditarEtiquetaForm"
              >
                <div className="flex gap-10">
                  <div className="flex flex-col">
                    <label
                      htmlFor="nombre"
                      className="text-sm text-slate-700 font-semibold"
                    >
                      Nombre:
                    </label>
                    <input
                      required
                      className="h-8 border-2 border-gray-300 rounded-sm p-2 focus:outline-gray-400 hover:bg-gray-100"
                      autoComplete="off"
                      name="nombre"
                      id="nombre"
                      type="text"
                      defaultValue={etiqueta.nombre}
                      pattern="^[a-zA-Z0-9!@#$%^&*-()_+]{1,15}$"
                      title="El nombre de la etiqueta debe tener entre 1 y 15 caracteres alfanuméricos"
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="color"
                      className="text-sm text-slate-700 font-semibold"
                    >
                      Color:
                    </label>
                    <DropdownColores
                      onColorSeleccionadoChange={
                        handleColorSeleccionado
                      }
                      colorActual={etiqueta.color}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="w-full flex items-center justify-center">
              <div className="flex gap-10 mt-8">
                <button
                  className="rounded-none hover:text-blue-500 text-sm"
                  onClick={handleClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="EditarEtiquetaForm"
                  className="rounded-sm bg-jiraBlue text-white px-2 py-1 hover:bg-blue-500"
                >
                  <p className="text-sm">Aceptar cambios</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default ModalEditarEtiqueta;
