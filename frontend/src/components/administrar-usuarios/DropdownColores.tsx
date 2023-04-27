import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import type { TagColor } from '@atlaskit/tag';

const URI = `${import.meta.env.VITE_APP_BACKEND_URI}/colores`;

interface Color {
  id: number;
  color: TagColor;
}

interface DropdownColoresProps {
  onColorSeleccionadoChange: (valor: TagColor) => void;
  colorActual?: TagColor;
}

const DropdownColores: FC<DropdownColoresProps> = ({
  onColorSeleccionadoChange,
  colorActual,
}) => {
  const [colores, setColores] = useState<Color[]>([]);
  const [color, setColor] = useState<TagColor>(
    colorActual || 'standard'
  );

  const getColores = () => {
    const res = axios.get(URI);
    res.then((res) => {
      setColores(res.data);
    });
  };

  const handleColorChange = (
    e: React.FormEvent<HTMLSelectElement>
  ) => {
    const target = e.target as HTMLSelectElement;
    const value = target.value as TagColor;
    const colorSeleccionado = value;
    setColor(colorSeleccionado);
    onColorSeleccionadoChange(colorSeleccionado);
  };

  useEffect(() => {
    getColores();
  }, []);

  return (
    <select
      onChange={handleColorChange}
      value={color}
      name="color"
      id="dropdown-colores"
      className={`w-full h-8 bg-slate-100 rounded-md pl-2 hover:bg-gray-200 text-sm text-gray-600 font-medium focus:border-0`}
    >
      {!colorActual && (
        <option disabled={true} value="">
          Selecciona un color
        </option>
      )}

      {colores.map((color) => (
        <option key={color.id} value={color.color}>
          {color.color}
        </option>
      ))}
    </select>
  );
};

export default DropdownColores;
