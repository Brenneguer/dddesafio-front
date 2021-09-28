import { Perfil } from './perfil';

export interface FiltrosUsuario {
  nome: string | undefined,
  ativo: boolean | undefined,
  inativo: boolean | undefined,
  perfil: Perfil | undefined
}
