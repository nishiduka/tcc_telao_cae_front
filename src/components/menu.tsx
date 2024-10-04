import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        {/* Ícone de Menu Hambúrguer */}
        <NavbarToggler onClick={toggle}>CLIQUE AQUI</NavbarToggler>

        {/* Menu colapsável */}
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/home">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/about">Sobre</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/services">Serviços</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/contact">Contato</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default App;
