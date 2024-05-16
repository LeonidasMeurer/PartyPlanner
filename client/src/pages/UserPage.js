import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Outlet, useParams, Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Nav, Sidenav, Container, Header, Content, Sidebar } from "rsuite";
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import VeranstaltungModal from "../components/Veranstaltung/VeranstaltungModal";
import UserForm from "../components/Users/UserForm";


const UserPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userId = cookies.userId
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  console.log(userId)


  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/user/${userId}`)
      const json = await response.json()
      console.log(json)
      setUser(json[0])
      return json;
    } catch (err) {
      console.error(err)
    }
  }


  useEffect(() => {
    getData();
  }, []);

  if (!user) {
    return (
      <p>loading</p>
    )
  }

  return (
    <div>
      <NavBar />
      <Container>
        <Sidebar
          style={{ display: 'flex', flexDirection: 'column' }}
          width={260}
          collapsible
        >
          <Sidenav appearance='inverse' defaultOpenKeys={['3', '4']} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Sidenav.Body>
              <Nav activeKey={1}>
                <Nav.Item eventKey="1" icon={<GroupIcon />} onClick={() => { navigate(`teilnehmer`)}} >
                  Account
                </Nav.Item>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </Sidebar>
        <Container>
            <Content>
                <UserForm
                userId={userId}
                getData={getData}
                user={user}/>
            </Content>
        </Container>

      </Container>
    </div>

  );
}

export default UserPage;