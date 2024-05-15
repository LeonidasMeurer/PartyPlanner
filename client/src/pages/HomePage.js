import NavBar from "../components/NavBar";
import VeranstaltungModal from "../components/VeranstaltungModal";
import VeranstaltungenTable from '../components/VeranstaltungenTable'
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Button } from "rsuite";

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
      <h1>Meine Veranstaltungen</h1>
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
      <Button appearance="primary" color="green" onClick={() => { setShowModal(true); setEditMode(false) }}>Create New</Button>
    </div>
  );
}