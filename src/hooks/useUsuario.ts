import { useContext } from 'react';
import { UsuarioContext, UsuarioContextType } from '../contexts/UsuarioContext';

export function useUsuario(): UsuarioContextType {
  const value = useContext(UsuarioContext);
  return value;
}
