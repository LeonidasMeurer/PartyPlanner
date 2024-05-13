import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Outlet, useParams, Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Nav, Sidenav, Container, Header, Content, Sidebar } from "rsuite";
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import VeranstaltungModal from "../components/VeranstaltungModal";


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
          <Sidenav appearance='inverse' defaultOpenKeys={['3', '4']} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Sidenav.Body>
              <Nav activeKey={activeKey}>
                <Nav.Item eventKey="1" icon={<DashboardIcon />} onClick={() => { navigate(``); setActiveKey('1') }}>
                  Dashboard
                </Nav.Item>
                <Nav.Item eventKey="2" icon={<GroupIcon />} onClick={() => { navigate(`teilnehmer`); setActiveKey('2') }} >
                  Teilnehmer
                </Nav.Item>
                <Nav.Menu eventKey="3" title="Advanced" icon={<MagicIcon />}>
                  <Nav.Item eventKey="3-1">Geo</Nav.Item>
                  <Nav.Item eventKey="3-2">Devices</Nav.Item>
                  <Nav.Item eventKey="3-3">Loyalty</Nav.Item>
                  <Nav.Item eventKey="3-4">Visit Depth</Nav.Item>
                </Nav.Menu>
                <Nav.Menu eventKey="4" title="Settings" icon={<GearCircleIcon />}>
                  <Nav.Item eventKey="4-1">Applications</Nav.Item>
                  <Nav.Item eventKey="4-2">Channels</Nav.Item>
                  <Nav.Item eventKey="4-3">Versions</Nav.Item>
                  <Nav.Menu eventKey="4-5" title="Custom Action" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Nav.Item eventKey="4-5-1">Action Name</Nav.Item>
                    <Nav.Item eventKey="4-5-2">Action Params</Nav.Item>
                  </Nav.Menu>
                </Nav.Menu>
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