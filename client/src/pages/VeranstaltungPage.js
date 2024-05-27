import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Outlet, useParams, Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Nav, Sidenav, Container, Header, Content, Sidebar } from "rsuite";
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import List from '@rsuite/icons/legacy/List';
import CheckOutlineIcon from '@rsuite/icons/CheckOutline';
import BarLineChartIcon from '@rsuite/icons/BarLineChart';
import SentToUserIcon from '@rsuite/icons/SentToUser';





const VeranstaltungPage = () => {
  const params = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.authToken
  const userEmail = cookies.userEmail
  const [veranstaltung, setVeranstaltung] = useState(undefined);
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('1');

  console.log(params.v_id)
  console.log(veranstaltung)

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung/${params.v_id}`)
      const json = await response.json()
      console.log(json)
      setVeranstaltung(json)
      return json;
    } catch (err) {
      console.error(err)
    }
  }


  useEffect(() => {
    getData();
  }, []);

  if (!veranstaltung) {
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
          <Sidenav appearance='inverse' defaultOpenKeys={['3', '4']} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Sidenav.Body>
              <Nav activeKey={activeKey}>
                <Nav.Item eventKey="1" icon={<DashboardIcon />} onClick={() => { navigate(``); setActiveKey('1') }}>
                  Dashboard
                </Nav.Item>
                <Nav.Item eventKey="2" icon={<GroupIcon />} onClick={() => { navigate(`teilnehmer`); setActiveKey('2') }} >
                  Teilnehmer
                </Nav.Item>
                <Nav.Item eventKey="3" icon={<List />} onClick={() => { navigate(`rezepte`); setActiveKey('3') }} >
                  Essen
                </Nav.Item>
                <Nav.Item eventKey="4" icon={<CheckOutlineIcon />} onClick={() => { navigate(`aufgaben`); setActiveKey('4') }} >
                  Aufgaben
                </Nav.Item>
                <Nav.Item eventKey="5" icon={<BarLineChartIcon />} onClick={() => { navigate(`statistik`); setActiveKey('5') }} >
                  Statistik
                </Nav.Item>
                <Nav.Item eventKey="6" icon={<SentToUserIcon />} onClick={() => { navigate(`/guestpage/${params.v_id}`); setActiveKey('6') }} >
                  Gäste Seite
                </Nav.Item>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </Sidebar>
        <Container>
          <Content>
            <Outlet context={veranstaltung}
            />
          </Content>
        </Container>
      </Container>
    </div>

  );
}

export default VeranstaltungPage;