import React, { FC, createContext, useState } from "react";

export interface PreguntaType {
  id: number;
  pregunta: string;
  predeterminada: boolean;
  id_tipo_pregunta: number;
  opciones?: string | null;
}

export interface EtiquetaType {
  id: number;
  nombre: string;
  color: string;
  id_color: number;
}

export interface Usuario {
  id: number;
  correo: string;
  password: string;
  nombre: string;
  foto: string;
  rol: number;
  etiquetas: EtiquetaType[];
}

export interface newRetroType {
  id?: number;
  titulo?: string;
  descripcion?: string | null;
  predeterminadas?: PreguntaType[];
  otras?: PreguntaType[];
  usuarios?: Usuario[];
  etiquetas?: EtiquetaType[]; //Esta parte del contexto va a guardar las etiquetas del select de etiquetas
}

interface ContextProps {
  newRetro: newRetroType | null;
  setNewRetro: (
    updater: (prevNewRetro: newRetroType) => newRetroType
  ) => void;
}

export const newRetroContext = createContext<ContextProps>({
  newRetro: null,
  setNewRetro: (
    updater: (prevNewRetro: newRetroType) => newRetroType
  ) => {},
});

interface newRetroContextProps {
  children: React.ReactNode;
}

const NewRetroProvider: FC<newRetroContextProps> = ({ children }) => {
  const [newRetro, setNewRetro] = useState<newRetroType>({
    id: 0,
    titulo: '',
    descripcion: null,
    predeterminadas: [],
    otras: [],
    usuarios: [],
    etiquetas: [],
  });

  return (
    <newRetroContext.Provider value={{ newRetro, setNewRetro }}>
      {children}
    </newRetroContext.Provider>
  );
};

export default NewRetroProvider;
