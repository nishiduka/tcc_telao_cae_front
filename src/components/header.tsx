import { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Dropdown,
} from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import Menu from './menu';

const Header = ({ userName }: { userName: string }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuth();

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Navbar className="bg-success-subtle" style={{ width: '100%' }}>
      <Container className="d-flex justify-content-between">
        <NavbarBrand href="/dashboard" className="ps-4">
          Telao
        </NavbarBrand>

        <div>
          <Menu />
          <Nav className="ml-auto" navbar>
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle caret color="success">
                {userName}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => logout()}>Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
