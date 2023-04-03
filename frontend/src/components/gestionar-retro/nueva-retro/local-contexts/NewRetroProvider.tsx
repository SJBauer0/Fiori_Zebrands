import React, { FC, createContext, useState } from 'react';

export interface PreguntaType {
  id: number;
  pregunta: string;
  predeterminada: boolean;
  id_tipo_pregunta: number;
}

export interface newRetroType {
  basic?: {
    title: string;
    description: string;
  };
  predeterminadas?: PreguntaType[];
  otras?: PreguntaType[];
  // !Cambiar tipo de usuario que no sea any
  usuarios?: any;
}

interface ContextProps {
  newRetro: newRetroType | null;
  setNewRetro: (prevNewRetro: newRetroType) => newRetroType | void;
}

export const newRetroContext = createContext<ContextProps>({
  newRetro: null,
  setNewRetro: (prevNewRetro: newRetroType) => {},
});

interface newRetroContextProps {
  children: React.ReactNode;
}

const NewRetroProvider: FC<newRetroContextProps> = ({ children }) => {
  const [newRetro, setNewRetro] = useState<newRetroType>({
    basic: {
      title: '',
      description: '',
    },
    predeterminadas: [],
    otras: [],
    usuarios: [],
  });

  return (
    <newRetroContext.Provider value={{ newRetro, setNewRetro }}>
      {children}
    </newRetroContext.Provider>
  );
};

export default NewRetroProvider;
