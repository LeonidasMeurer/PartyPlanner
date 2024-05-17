import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Nav, Sidenav, Container, Content, Sidebar } from "rsuite";
import GroupIcon from '@rsuite/icons/legacy/Group';
import List from '@rsuite/icons/legacy/List';
import RezeptModal from "../components/Rezepte/RezeptModal";



const UserPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userId = cookies.userId
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('1');

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
    <>
      <NavBar />
      <Container>
        <Sidebar
          style={{ display: 'flex', flexDirection: 'column' }}
          width={260}
          collapsible
        >
          <Sidenav appearance='inverse' defaultOpenKeys={['3', '4']} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Sidenav.Body>
              <Nav activeKey={activeKey}>
                <Nav.Item eventKey="1" icon={<GroupIcon />} onClick={() => { navigate(``); setActiveKey(1) }} >
                  Account
                </Nav.Item>
              </Nav>
              <Nav activeKey={1}>
                <Nav.Item eventKey="2" icon={<List />} onClick={() => { navigate(`rezepte`); setActiveKey(2) }} >
                  Rezepte
                </Nav.Item>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </Sidebar>
        <Container>
          <Content>
            <Outlet context={[userId, getData, user]} />
          </Content>
        </Container>
        

      </Container>


    </>

  );
}

export default UserPage;