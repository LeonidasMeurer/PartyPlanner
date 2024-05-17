import { Navbar, Nav } from 'rsuite';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import MemberIcon from '@rsuite/icons/Member';


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
      <Nav>
        <Nav.Item style={{ width: 260 }} onClick={() => { navigate(`/`) }}>PartyPlanner</Nav.Item>
      </Nav>
      <Nav pullRight>
        <Nav.Item icon={<MemberIcon />} onClick={() => { navigate(`/user/${u_id}`) }}>Account</Nav.Item>
        <Nav.Item onClick={() => singOut()}>Logout</Nav.Item>
      </Nav>
    </Navbar>
  )
};

export default NavBar;