import React, { createContext, ReactNode, useState } from 'react';
import { Usuario } from '../model/usuario';

export type UsuarioContextType = {
  usuarioContext: Usuario | undefined;
  atualizarUsuario: (user: Usuario) => void;
}

type UsuarioContextProviderProps = {
  children: ReactNode;
};

export const UsuarioContext = createContext({} as UsuarioContextType);
export function UsuarioContextProvider(props: UsuarioContextProviderProps): JSX.Element {
  const { children } = props;
  const [usuarioContext, setUsuario] = useState<Usuario>();

  const atualizarUsuario = (user: Usuario) => {
    setUsuario(user);
  };
  return (
    <UsuarioContext.Provider value={{
      usuarioContext,
      atualizarUsuario,
    }}
    >
      {children}
    </UsuarioContext.Provider>
  );
}
