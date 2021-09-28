import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Col,
  Form, Navbar, Row,
  Table,
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Usuario } from '../model/usuario';
import {
  ativar,
  buscarTodosPerfis,
  buscarTodosUsuarios, buscarUsuariosComFiltro, deletarUsuario, inativar,
} from '../services/restService';

import '../styles/global.scss';
import '../styles/home.scss';

import lupaItem from '../assets/lupa.svg';
import maisItem from '../assets/mais.svg';
import lapisItem from '../assets/lapis.svg';
import lixeiraItem from '../assets/lixeira.svg';

import { FiltrosUsuario } from '../model/filtros';
import { Perfil } from '../model/perfil';
import MenuLateral from '../components/MenuLateral';
import { ModalAlert } from '../components/ModalAlert';
import { MN005, MN032, MN033 } from '../services/messages';
import { useUsuario } from '../hooks/useUsuario';

function Home(): JSX.Element {
  const history = useHistory();
  const { atualizarUsuario } = useUsuario();
  const [todosUsuarios, setUsuarios] = useState<Usuario[]>();
  const [todosPerfis, setPerfisCadastrado] = useState<Perfil[]>();
  const [nome, setNome] = useState('');
  const [ativo, setAtivo] = useState('');
  const [idPerfil, setPerfil] = useState<number>(0);
  const [mensagem, setMensagem] = useState('');
  const [showModalDelete, setDeleteShow] = useState(false);
  const [userSelecionado, setUsuario] = useState<Usuario>();
  const [showSucess, setShowAlertSucess] = useState(false);
  const [showError, setShowAlertError] = useState(false);

  const handleShowSucess = () => setShowAlertSucess(true);

  const handleDeleteShow = () => setDeleteShow(true);
  const handleDeleteClose = () => setDeleteShow(false);

  const handleSituacaoChange = (event: any) => { // eslint-disable-line
    setAtivo(event.target?.value);
  };
  const handlePerfilChange = (event: any) => { // eslint-disable-line
    setPerfil(event.target?.value);
  };

  const handleButtonDelete = (event: any) => { // eslint-disable-line
    const user = todosUsuarios?.find((element) => `${element.id}` === event.target.parentNode.id);
    setUsuario(user);
    handleDeleteShow();
  };

  const handleIncluir = () => {
    history.push('/incluir');
  };

  const handlePesquisar = async () => {
    const filtro: FiltrosUsuario = {
      nome: undefined,
      ativo: undefined,
      inativo: undefined,
      perfil: undefined,
    };
    if (ativo === 'ativo') {
      filtro.ativo = true;
    }
    if (ativo === 'inativo') {
      filtro.inativo = true;
    }
    if (nome !== '') {
      filtro.nome = nome;
    }
    if (idPerfil !== 0 && idPerfil.toString() !== 'Selecione um perfil') {
      filtro.perfil = {
        id: idPerfil, nome: undefined, isAtivo: undefined,
      };
    }
    const usuarios = await buscarUsuariosComFiltro(filtro);
    setUsuarios(usuarios);
  };

  const handleEditar = (event: any) => { //eslint-disable-line
    const user = todosUsuarios?.find((element) => `${element.id}` === event.target.parentNode.id);
    if (user === undefined) {
      return;
    }
    atualizarUsuario(user);
    history.push('/incluir');
  };

  const handleDeletar = async () => {
    if (userSelecionado === undefined) {
      return;
    }
    const response = await deletarUsuario(userSelecionado);
    if (response === MN005) {
      setMensagem(MN005);
      handleShowSucess();
      handleDeleteClose();
      atualizarListaDeUsuarios();
    }
  };

  const handleDesabilitarUsuario = async (event: any) => {  // eslint-disable-line
    const user = todosUsuarios?.find((element) => `${element.id}` === event.target.id);
    if (user === undefined) {
      return;
    }
    setUsuario(user);
    if (!user.ativo) {
      user.ativo = !user.ativo;
      const response = await ativar(user);
      if (response === MN033) {
        mudarStatusUsuario(MN033);
      }
    } else {
      user.ativo = !user.ativo;
      const response = await inativar(user);
      if (response === MN032) {
        mudarStatusUsuario(MN032);
      }
    }
  };

  function mudarStatusUsuario(msg: string) {
    setMensagem(msg);
    handleShowSucess();
    atualizarListaDeUsuarios();
  }

  const atualizarListaDeUsuarios = async () => {
    const usuarios = await buscarTodosUsuarios();
    setUsuarios(usuarios);
  };

  useEffect(() => {
    async function buscar() {
      try {
        const users = await buscarTodosUsuarios();
        const perfis = await buscarTodosPerfis();
        if (users !== undefined) {
          setUsuarios(users);
        }
        if (perfis !== undefined) {
          setPerfisCadastrado(perfis);
        }
      } catch (err) {
        <div>Deu ruim por enquanto</div>;
      }
    }
    if (todosUsuarios === undefined) {
      buscar();
    }
  });

  return (
    <div className="container-app">
      <Navbar className="nav-users">
        <Navbar.Brand className="title">
          <h2>Datainfo</h2>
        </Navbar.Brand>
        <div>
          <h3>Usuários</h3>
        </div>
      </Navbar>
      <div className="body">
        <MenuLateral />
        <div className="container-fluid">
          <div>
            <Alert show={showSucess} variant="success" onClose={() => setShowAlertSucess(false)} dismissible>
              <p>
                {mensagem}
              </p>
            </Alert>
            <Alert show={showError} variant="danger" onClose={() => setShowAlertError(false)} dismissible>
              <p>
                {mensagem}
              </p>
            </Alert>
          </div>
          <div>
            <Navbar>
              <div>
                Parâmetros
                {' > '}
                <a href="/">Usuários</a>
              </div>
            </Navbar>
            <div className="top-menu">
              <div className="header">
                <h4>
                  Lista de Usuários
                </h4>
              </div>
              <div className="filtros">
                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Nome:</Form.Label>
                      <Form.Control type="text" onChange={(event) => setNome(event.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Label>Situação:</Form.Label>
                    <Form.Select aria-label="selecione um status" value={ativo} onChange={handleSituacaoChange}>
                      <option value="todos">Todos</option>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Label>Perfil:</Form.Label>
                    <Form.Select aria-label="selecione um perfil" value={undefined} onChange={handlePerfilChange}>
                      <option value={undefined}>Selecione um perfil</option>
                      {
                        todosPerfis?.map(
                          (p) => <option key={p.id} value={p.id}>{p.nome}</option>,
                        )
                      }
                    </Form.Select>
                  </Col>
                </Row>
              </div>
              <div className="footer">
                <div>
                  <Button onClick={handlePesquisar}>
                    <img src={lupaItem} alt="pesquisar" />
                    Pesquisar
                  </Button>
                </div>
              </div>
            </div>
            <div className="table-content">
              <div className="button-element">
                <Button onClick={handleIncluir}>
                  <img src={maisItem} alt="mais" />
                  Incluir
                </Button>
              </div>
              <div className="table">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>E-mail</th>
                      <th>Nome</th>
                      <th>Perfil</th>
                      <th>Habilitado</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      todosUsuarios?.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>{usuario.email}</td>
                          <td>{usuario.nome}</td>
                          <td>{usuario.perfil.nome}</td>
                          <td className="input-checkbox">
                            <input
                              type="checkbox"
                              id={`${usuario.id}`}
                              name={usuario.nome}
                              checked={usuario.ativo}
                              onChange={handleDesabilitarUsuario}
                            />
                          </td>
                          <td>
                            <div>
                              <Button
                                id={`${usuario.id}`}
                                onClick={handleEditar}
                                value={usuario.id}
                              >
                                <img src={lapisItem} alt="editar" />
                              </Button>
                              <Button
                                id={`${usuario.id}`}
                                onClick={handleButtonDelete}
                                value={usuario.id}
                              >
                                <img src={lixeiraItem} alt="excluir" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalAlert
        showModal={showModalDelete}
        onClick={handleDeletar}
        onClose={handleDeleteClose}
        modalButtons
      >
        <div>Confirmar exclusão</div>
        <div>
          Deseja excluir o usuário
          <br />
          {
            `Nome: ${userSelecionado?.nome}`
          }
          <br />
          Essa operação não pode ser desfeita!
        </div>
      </ModalAlert>
    </div>
  );
}

export default Home;
