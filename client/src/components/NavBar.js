import { Navbar, Nav } from 'rsuite';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [cookies, setCookie, removeCookie] = useCookies()
  const u_id = cookies.userId
  const navigate = useNavigate();
  const singOut = () => {
    removeCookie('userEmail')
    removeCookie('userId')
    removeCookie('authToken')
    window.location.reload()
  }

 return (
  <Navbar appearance='inverse'>
    <Navbar.Brand style={{ width: 260 }} href="#">PartyPlanner</Navbar.Brand>
    <Nav>
      <Nav.Item onClick={() => { navigate(`/`)}} >Home</Nav.Item>
      <Nav.Item onClick={() => { navigate(`/user/${u_id}`)}} >User</Nav.Item>
      <Nav.Item>Products</Nav.Item>
      <Nav.Menu title="About">
        <Nav.Item>Company</Nav.Item>
        <Nav.Item>Team</Nav.Item>
        <Nav.Menu title="Contact">
          <Nav.Item>Via email</Nav.Item>
          <Nav.Item>Via telephone</Nav.Item>
        </Nav.Menu>
      </Nav.Menu>
    </Nav>
    <Nav pullRight>
      <Nav.Item onClick={() => singOut()}>Logout</Nav.Item>
    </Nav>
  </Navbar>
)};

export default NavBar;