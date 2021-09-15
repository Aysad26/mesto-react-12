import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import '../index.css';
import logo from '../images/logo.svg';

function Header({ email, onClick }) {

  const [isOpen, setIsOpen] = React.useState(true);
  const [isClicked, setIsClicked] = React.useState(false);

  const linkClassName = "menu__item";

  return (
    <>
     <header className="header">
       <img
        className="logo"
        src={logo}
        alt="логотип проекта"
      />
        <div className="menu">
          <Switch>
            <Route path="/sign-in">
              <Link to="/sign-up" className={linkClassName}>Регистрация</Link>
            </Route>
            <Route path="/sign-up">
              <Link to="/sign-in" className={linkClassName}>Войти</Link>
            </Route>
            <Route path="/">
              <nav className="menu">
                <p className={linkClassName}>{email}</p>
                <Link onClick={onClick} className={linkClassName}>Выйти</Link>
              </nav>
            </Route>
          </Switch>
        </div>
      </header>
    </>
  );
}

export default Header;
