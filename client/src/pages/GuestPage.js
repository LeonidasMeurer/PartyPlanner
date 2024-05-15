import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar, Container, Panel, Text, Heading, PanelGroup, Button } from 'rsuite';
import TeilnehmerTable from "../components/TeilnehmerTable";
import GuestModal from "../components/GuestModal";
import GaesteTable from "../components/GaesteTable";

const GuestPage = () => {
    const params = useParams()
    const v_id = params.v_id
    const [veranstaltung, setVeranstaltung] = useState(undefined);
    const [gaeste, setGaeste] = useState(undefined);
    const [showModal, setShowModal] = useState(false)


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
                body: JSON.stringify({g_id, zusage})
            })
            console.log(response)
            if (response.status === 200) {
                getGaeste()
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
                <Navbar.Brand href="#">PartyPlanner</Navbar.Brand>
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
                    <Text weight="regular">{veranstaltung.beschreibung} </Text>
                </Panel>
                <Panel header='Helfer Liste' defaultExpanded>
                    <TeilnehmerTable />
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