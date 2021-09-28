import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Col,
  Form, Navbar, Row,
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { mask, maskTel, validarCpf } from '../services/mask';
import { Usuario } from '../model/usuario';
import { buscarTodasFuncoes, buscarTodosPerfis, criarUsuario } from '../services/restService';

import '../styles/global.scss';
import '../styles/newUser.scss';

import maisItem from '../assets/mais.svg';
import setaItem from '../assets/seta-esquerda.svg';

import { Perfil } from '../model/perfil';
import MenuLateral from '../components/MenuLateral';
import { Funcao } from '../model/funcao';
import { MN001, MN030, MN034 } from '../services/messages';
import { useUsuario } from '../hooks/useUsuario';

function NovoUsuario(): JSX.Element {
  const history = useHistory();
  const { usuarioContext } = useUsuario();
  const [todasFuncoes, setFuncoesCadastradas] = useState<Funcao[]>();
  const [todosPerfis, setPerfisCadastrado] = useState<Perfil[]>();
  const [id, setId] = useState<number>();
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [idFuncao, setFuncao] = useState<number>(0);
  const [idPerfil, setPerfil] = useState<number>(0);
  const [showSucess, setShowAlertSucess] = useState(false);
  const [showError, setShowAlertError] = useState(false);

  const handleShowSucess = () => setShowAlertSucess(true);
  const handleShowError = () => setShowAlertError(true);

  const handleFuncaoChange = (event: any) => { // eslint-disable-line
    setFuncao(event.target?.value);
  };

  const handlePerfilChange = (event: any) => { // eslint-disable-line
    setPerfil(event.target?.value);
  };

  const onChangeCpf = (value: string) => { // eslint-disable-line
    setCpf(mask(value));
  };

  const onChangeTel = (value: string) => { // eslint-disable-line
    setTelefone(maskTel(value));
  };

  useEffect(() => {
    if (usuarioContext) {
      setId(usuarioContext.id);
      setNome(usuarioContext.nome);
      setEmail(usuarioContext.email);
      setCpf(usuarioContext.cpf);
      setTelefone(usuarioContext.telefone);
      setFuncao(usuarioContext.funcao.id);
      setPerfil(usuarioContext.perfil.id);
    }
  }, [usuarioContext]);

  useEffect(() => {
    async function buscar() {
      try {
        const funcoes = await buscarTodasFuncoes();
        const perfis = await buscarTodosPerfis();
        if (funcoes !== undefined) {
          setFuncoesCadastradas(funcoes);
        }
        if (perfis !== undefined) {
          setPerfisCadastrado(perfis);
        }
      } catch (err) {
        <div>Deu ruim por enquanto</div>;
      }
    }
    if (todasFuncoes === undefined) {
      buscar();
    }
  });

  const handleVoltar = () => {
    history.push('/');
  };

  const handleSalvar = async () => {
    const usuario: Usuario = {
      id,
      nome,
      email,
      cpf,
      telefone,
      funcao: {
        id: idFuncao,
        nome: undefined,
        isAtivo: undefined,
      },
      perfil: {
        id: idPerfil,
        nome: undefined,
        isAtivo: undefined,
      },
      ativo: true,
    };

    const response = await criarUsuario(usuario);
    if (response !== undefined && response === MN001) {
      setMensagem(MN001);
      handleShowSucess();
      limparInputs();
    } else if (response !== undefined && response === MN030) {
      setMensagem(MN030);
      handleShowSucess();
      limparInputs();
    } else {
      handleShowError();
      setMensagem(MN034);
    }
  };

  const exibirButton = (): boolean => {
    if (email !== undefined && email !== '' && nome !== undefined && nome !== ''
      && validarCpf(cpf)
      && telefone !== undefined && telefone !== ''
      && idFuncao.toString() !== 'Selecione uma função'
      && idFuncao !== 0
      && idPerfil.toString() !== 'Selecione um Perfil'
      && idPerfil !== 0) {
      return true;
    }
    return false;
  };

  const limparInputs = () => {
    setEmail(' ');
    setNome(' ');
    setCpf(' ');
    setTelefone('');
    setFuncao(0);
    setPerfil(0);
  };

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
                {' > '}
                Incluir
              </div>
            </Navbar>
            <div>
              <div className="top-menu-user">
                <div className="header">
                  <h4>
                    Incluir Usuários
                  </h4>
                </div>
                <div className="filtros">
                  <h4>* Campos obrigatórios</h4>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email: *</Form.Label>
                        <Form.Control type="text" onChange={(event) => setEmail(event.target.value)} value={email} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Nome: *</Form.Label>
                        <Form.Control type="text" onChange={(event) => setNome(event.target.value)} value={nome} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>CPF: *</Form.Label>
                        <Form.Control type="text" maxLength={14} onChange={(event) => onChangeCpf(event.target.value)} value={cpf} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Telefone: *</Form.Label>
                        <Form.Control type="text" maxLength={15} onChange={(event) => onChangeTel(event.target.value)} value={telefone} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Label>Funcao: *</Form.Label>
                      <Form.Select aria-label="selecione uma função" value={idFuncao} onChange={handleFuncaoChange}>
                        <option value={undefined}>Selecione uma função</option>
                        {
                          todasFuncoes?.map(
                            (f) => <option key={f.id} value={f.id}>{f.nome}</option>,
                          )
                        }
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Label>Perfil: *</Form.Label>
                      <Form.Select aria-label="selecione um perfil" value={idPerfil} onChange={handlePerfilChange}>
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
                    <Button onClick={handleVoltar}>
                      <img src={setaItem} alt="voltar" />
                      Voltar
                    </Button>
                  </div>
                  <div>
                    <Button disabled={!exibirButton()} onClick={handleSalvar}>
                      <img src={maisItem} alt="salvar" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NovoUsuario;
