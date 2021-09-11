import '../index.css';
import logo from '../images/logo.svg';

function Header() {
  return (
  <header className="header">
    <img
      className="logo"
      src={logo}
      alt="логотип проекта"
    />
  </header>
  );
}

export default Header;
