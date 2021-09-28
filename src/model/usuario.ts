import { Funcao } from './funcao';
import { Perfil } from './perfil';

export interface Usuario {
  id: number | undefined,
  nome: string,
  email: string,
  cpf: string,
  telefone: string,
  ativo: boolean,
  funcao: Funcao,
  perfil: Perfil
}
