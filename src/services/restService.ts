import axios from 'axios';
import {
  MN001, MN005, MN030, MN032, MN033, MN034,
} from './messages';
import { Funcao } from '../model/funcao';
import { FiltrosUsuario } from '../model/filtros';
import { Perfil } from '../model/perfil';
import { Usuario } from '../model/usuario';

const url = process.env.REACT_APP_SERVER_URL;

async function buscarTodosUsuarios(): Promise<Usuario[]> {
  const user = await axios({
    method: 'GET',
    url: `${url}usuarios/`,
  }).then((response) => response.data)
    .catch(() => undefined);
  return user;
}

async function buscarTodosPerfis(): Promise<Perfil[]> {
  const perfis = await axios({
    method: 'GET',
    url: `${url}perfis/`,
  }).then((response) => response.data)
    .catch(() => undefined);
  return perfis;
}

async function buscarTodasFuncoes(): Promise<Funcao[]> {
  const funcoes = await axios({
    method: 'GET',
    url: `${url}funcoes/`,
  }).then((response) => response.data)
    .catch(() => undefined);
  return funcoes;
}

async function buscarUsuariosComFiltro(filtro: FiltrosUsuario): Promise<Usuario[]> {
  if (filtro.ativo === undefined
    && filtro.inativo === undefined
    && filtro.nome === ''
    && filtro.perfil === undefined) {
    return buscarTodosUsuarios();
  }

  const users = await axios({
    method: 'POST',
    url: `${url}usuarios/filtrar/`,
    data: filtro,
  }).then((response) => response.data)
    .catch(() => undefined);
  return users;
}

async function criarUsuario(usuario: Usuario): Promise<Usuario | string> {
  if (usuario.id !== undefined) {
    const response = await atualizarUsuario(usuario);
    if (response !== undefined) {
      return MN030;
    }
  }
  const findUser = await buscarPorCpf(usuario.cpf);
  if (findUser !== undefined) {
    return MN034;
  }
  const user = await axios({
    method: 'POST',
    url: `${url}usuarios/`,
    data: usuario,
  }).then((response) => response.data)
    .catch(() => undefined);

  if (user !== undefined) {
    return MN001;
  }
  return user;
}

async function atualizarUsuario(usuario: Usuario): Promise<string | undefined> {
  const user = await axios({
    method: 'PUT',
    url: `${url}/usuarios/`,
    data: usuario,
  }).then((response) => response.data)
    .catch(() => undefined);
  if (user) {
    return MN030;
  }
  return undefined;
}

async function inativar(usuario: Usuario): Promise<string> {
  const retorno = await axios({
    method: 'PUT',
    url: `${url}usuarios/inativar/`,
    data: usuario,
  }).then((response) => response.data)
    .catch(() => undefined);

  if (retorno) {
    return MN032;
  }
  return retorno;
}

async function ativar(usuario: Usuario): Promise<string> {
  const retorno = await axios({
    method: 'PUT',
    url: `${url}usuarios/ativar/`,
    data: usuario,
  }).then((response) => response.data)
    .catch(() => undefined);
  if (retorno) {
    return MN033;
  }
  return retorno;
}

async function deletarUsuario(usuario: Usuario | undefined): Promise<string> {
  const retorno = await axios({
    method: 'DELETE',
    url: `${url}usuarios/`,
    data: usuario,
  }).then((response) => response.data)
    .catch(() => undefined);
  if (retorno) {
    return MN005;
  }
  return retorno;
}

async function buscarPorCpf(valor: string): Promise<Usuario> {
  const retorno = await axios({
    method: 'GET',
    url: `${url}usuarios/cpf/`,
    params: { cpf: valor },
  }).then((response) => response.data)
    .catch(() => undefined);
  return retorno;
}

export {
  buscarTodosUsuarios,
  buscarTodosPerfis,
  buscarUsuariosComFiltro,
  criarUsuario,
  inativar,
  ativar,
  deletarUsuario,
  buscarTodasFuncoes,
  buscarPorCpf,
};
