import React, { useState, useEffect } from 'react';
import Select, { StylesConfig } from 'react-select';
import axios from 'axios';

const URI = 'http://localhost:8000/etiquetas';

interface Props {
  onEtiquetasSeleccionadasChange: (etiquetas: string[]) => void;
  etiquetasPreseleccionadas: EtiquetaPreseleccionada[];
}

interface EtiquetaPreseleccionada {
  id: string;
  nombre: string;
  color: string;
}

interface Etiqueta {
  value: number;
  label: string;
  color: string;
}

const DropdownEtiquetas = ({
  onEtiquetasSeleccionadasChange,
  etiquetasPreseleccionadas,
}: Props) => {
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [etiquetasPred, setEtiquetasPred] = useState<Etiqueta[]>([]);

  const [selectedEtiquetas, setSelectedEtiquetas] =
    useState<Etiqueta[]>(etiquetasPred);

  useEffect(() => {
    axios
      .get(URI)
      .then((response) => {
        const options = response.data.map((etiqueta: any) => ({
          value: etiqueta.id,
          label: etiqueta.etiqueta,
          color: etiqueta.color,
        }));
        setEtiquetas(options);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const etiquetaPS = etiquetasPreseleccionadas.map(
      (etiqueta): Etiqueta => ({
        value: parseInt(etiqueta.id, 10),
        label: etiqueta.nombre,
        color: etiqueta.color,
      })
    );

    setEtiquetasPred(etiquetaPS);
  }, [etiquetasPreseleccionadas]);

  etiquetasPreseleccionadas.map((etiqueta: any) => {
    const eP = {
      value: etiqueta.id,
      label: etiqueta.etiqueta,
      color: etiqueta.color,
    };
  });

  function handleEtiquetasChange(selected: any) {
    setSelectedEtiquetas(selected);
    const etiquetasSeleccionadas = selected.map(
      (etiqueta: any) => etiqueta.value
    );
    if (onEtiquetasSeleccionadasChange) {
      onEtiquetasSeleccionadasChange(etiquetasSeleccionadas);
    }
  }

  const colorStyles = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: 'white',
    }),
    multiValue: (
      styles: any,
      { data, isDisabled, isFocused, isSelected }: any
    ) => {
      if (data.color == 'blueLight') {
        return { ...styles, backgroundColor: '#CCE0FF' };
      } else if (data.color == 'yellowLight') {
        return { ...styles, backgroundColor: '#FFE2BD' };
      } else if (data.color == 'greenLight') {
        return { ...styles, backgroundColor: '#CCE0CC' };
      } else if (data.color == 'redLight') {
        return { ...styles, backgroundColor: '#FFCCCC' };
      } else if (data.color == 'tealLight') {
        return { ...styles, backgroundColor: '#CCE0E5' };
      } else if (data.color == 'purpleLight') {
        return { ...styles, backgroundColor: '#E5CCFF' };
      } else {
        return { ...styles, backgroundColor: '#DCDFE4' };
      }
    },
  };

  console.log(etiquetasPred);

  return (
    <div>
      <Select
        defaultValue={etiquetasPred}
        className="mt-1"
        id="etiquetas"
        name="etiquetas"
        options={etiquetas}
        isMulti={true}
        value={selectedEtiquetas}
        onChange={handleEtiquetasChange}
        styles={colorStyles}
      />
    </div>
  );
};

export default DropdownEtiquetas;
