import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar, Container, Panel, Text, Heading, PanelGroup, Button, Nav } from 'rsuite';
import TeilnehmerTable from "../components/Users/HelferTable";
import GuestModal from "../components/Gaeste/GaesteModal";
import GaesteTable from "../components/Gaeste/GaesteTable";
import HelferTable from "../components/Users/HelferTable";
import { useCookies } from "react-cookie";

const GuestPage = () => {
    const params = useParams()
    const navigate = useNavigate()
    const v_id = params.v_id
    const [veranstaltung, setVeranstaltung] = useState(undefined);
    const [gaeste, setGaeste] = useState(undefined);
    const [showModal, setShowModal] = useState(false)
    const [helfer, setHelfer] = useState(undefined);
    const [cookies, setCookie, removeCookie] = useCookies();
    const authToken = cookies.authToken
    const u_email = cookies.userEmail


    const getData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung/${v_id}`)
            const json = await response.json()
            console.log(json[0].v_name)
            setVeranstaltung(json[0])
            return json;
        } catch (err) {
            console.error(err)
        }
    }

    const getGaeste = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung_gaeste/${params.v_id}`)
            const json = await response.json()
            setGaeste(json)
            return json;
        } catch (err) {
            console.error(err)
        }
    }

    const getHelfer = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung_helfer/${params.v_id}`)
            const json = await response.json()
            console.log('setHelfer', json)
            setHelfer(json)
            return json;
        } catch (err) {
            console.error(err)
        }
    }

    const createGuest = async (g_name, zusage, anmerkung, g_ernaehrungsform, v_id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/guest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ g_name, zusage, anmerkung, g_ernaehrungsform, v_id })
            })
            if (response.status === 200) {
                setShowModal(false)
                getGaeste()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const editGuest = async (g_id, zusage) => {
        if (zusage === 'keine Antwort' || zusage === 'Abgesagt') {
            zusage = 'Zugesagt'
        } else {
            zusage = 'Abgesagt'
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/gast/${g_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zusage })
            })
            console.log(response)
            if (response.status === 200) {
                getGaeste()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const createHelfer = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung_helfer/${v_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ u_email, zusage: 'Zugesagt' })
            })
            if (response.status === 200) {
                getHelfer()
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getData();
        getGaeste()
    }, []);


    if (!veranstaltung) {
        return (
            <p>loading</p>
        )
    }

    return (
        <Container>
            <Navbar appearance='inverse'>
                <Nav>
                    <Nav.Item style={{ width: 260 }} onClick={() => { navigate(`/`) }}>PartyPlanner</Nav.Item>
                </Nav>
            </Navbar>
            <Heading style={{ paddingLeft: '10px' }} level={2}>Gäste Seite</Heading>
            <PanelGroup accordion bordered>
                <Panel header='Details' defaultExpanded>
                    <Heading style={{ paddingBottom: '10px' }} level={4}>{veranstaltung.v_name}</Heading>
                    <Heading level={5}>Datum</Heading>
                    <Text weight="regular">{veranstaltung.datum} </Text>
                    <Heading level={5}>Adresse</Heading>
                    <Text weight="regular">{veranstaltung.ort} </Text>
                    <Heading level={5}>Teilnehmeranzahl</Heading>
                    <Text weight="regular">{veranstaltung.teilnehmer_anzahl} </Text>
                    <Heading level={5}>Beschreibung</Heading>
                    <Text as='pre' weight="regular">{`${veranstaltung.beschreibung}`} </Text>
                </Panel>
                <Panel header='Helfer Liste' defaultExpanded>
                    <HelferTable
                        helfer={helfer}
                        getHelfer={getHelfer}
                    />
                    <Button appearance="primary" color="green" onClick={() => { authToken ? createHelfer() : navigate('/') }}>Join as Helfer</Button>
                </Panel>
                <Panel header='Gäste Liste' defaultExpanded>
                    <GaesteTable
                        gaeste={gaeste}
                        editGuest={editGuest}
                    />
                    <Button appearance="primary" color="green" onClick={() => { setShowModal(true) }}>Create New</Button>
                </Panel>
            </PanelGroup>
            {showModal &&
                <GuestModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    v_id={v_id}
                    getGaeste={getGaeste}
                    createGuest={createGuest}
                />
            }

        </Container>
    );
}

export default GuestPage;