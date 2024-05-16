import NavBar from "../components/NavBar";
import VeranstaltungModal from "../components/Veranstaltung/VeranstaltungModal";
import VeranstaltungenTable from '../components/Veranstaltung/VeranstaltungenTable'
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Button, Sidenav, Nav, Sidebar, Container, Content } from "rsuite";
import List from '@rsuite/icons/legacy/List';

export default function HomePage() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.authToken
  const userEmail = cookies.userEmail
  const userId = cookies.userId
  const [showModal, setShowModal] = useState(false)
  const [veranstaltungen, setVeranstaltungen] = useState(undefined);
  const [selectedVeranstaltung, setSelectedVeranstaltung] = useState(null)
  const [editMode, setEditMode] = useState(null)

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltungen/${userId}`)
      const json = await response.json()
      console.log(json[0])
      setVeranstaltungen(json)
      return json;
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getData();
  }, []);


  return (
    <div style={{ justifyContent: 'center', alignItems: 'center' }}>
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
            <Nav.Item eventKey="1" icon={<List />}>
              Meine Veranstaltungen
            </Nav.Item>

          </Nav>
        </Sidenav.Body>
        </Sidenav>
      </Sidebar>
      <Container>
          <Content>
      <VeranstaltungenTable
        setSelectedVeranstaltung={setSelectedVeranstaltung}
        setShowModal={setShowModal}
        veranstaltungen={veranstaltungen}
        setEditMode={setEditMode}
        getData={getData}
      />

      {showModal &&
        <VeranstaltungModal
          showModal={showModal}
          setShowModal={setShowModal}
          editMode={editMode}
          veranstaltung={selectedVeranstaltung}
          userEmail={userEmail}
          userId={userId}
          getData={getData}

        />
      }
      </Content>
      </Container>
      </Container>
    </div>
  );
}