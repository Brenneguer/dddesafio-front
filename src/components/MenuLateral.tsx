import React from 'react';

import menuItem from '../assets/menu-item.svg';
import homeItem from '../assets/home.svg';
import configItem from '../assets/config-item.svg';
import sobreItem from '../assets/sobre.svg';

function MenuLateral(): JSX.Element {
  return (
    <div className="toggle-menu">
      <div className="menu-itens">
        <img src={menuItem} alt="menu" />
        <div className="item">
          <img src={homeItem} alt="home" />
          <p>Principal</p>
        </div>
        <div className="item">
          <img src={configItem} alt="parametros" />
          <p>Parâmetros</p>
        </div>
        <div className="item-link"><p>Usuários</p></div>
        <div className="item">
          <img src={sobreItem} alt="sobre" />
          <p>Sobre</p>
        </div>
      </div>
    </div>
  );
}

export default MenuLateral;
