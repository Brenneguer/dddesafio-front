import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './styles/global.scss';
import Home from './pages/Home';
import NovoUsuario from './pages/NovoUsuario';
import { UsuarioContextProvider } from './contexts/UsuarioContext';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <UsuarioContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/incluir" exact component={NovoUsuario} />
        </Switch>
      </UsuarioContextProvider>
    </BrowserRouter>
  );
}

export default App;
