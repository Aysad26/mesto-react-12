import React from 'react';
import headerPath from '../images/logo.svg';
import { Link } from 'react-router-dom';

function Header({routePathName, routePath, emailUser, loggedIn, onSignOut}) {

  return (
    loggedIn === true ? (
      <header className="header">
        <img className="logo" src={headerPath} alt="Логотип"/>
        <div className="menu">
          <p className="menu__item">{emailUser}</p>
          <button onClick={onSignOut} className="menu__item" href={routePath}>{routePathName}</button>
        </div>
      </header>
    ) : (
      <header className="header">
        <img className="logo" src={headerPath} alt="Логотип"/>
        <div className="menu">
          <Link to={routePath} className="menu__item">{routePathName}</Link>
        </div>
      </header>
    )
  );
}

export default Header;