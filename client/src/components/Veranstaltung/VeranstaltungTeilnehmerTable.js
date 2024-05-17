import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar, Container, Panel, Text, Heading, PanelGroup, Button, Nav } from 'rsuite';
import HelferTable from "../Users/HelferTable";
import GaesteTable from "../Gaeste/GaesteTable";
import GuestModal from "../Gaeste/GaesteModal";
import HelferModal from "../Users/HelferModal";


const VeranstaltungTeilnehmerTable = () => {
    const params = useParams()
    const navigate = useNavigate()
    const v_id = params.v_id
    const [veranstaltung, setVeranstaltung] = useState(undefined);
    const [gaeste, setGaeste] = useState(undefined);
    const [showModal, setShowModal] = useState(false)
    const [showHelferModal, setShowHelferModal] = useState(false)
    const [helfer, setHelfer] = useState(undefined);


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
                body: JSON.stringify({ g_id, zusage })
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
        getGaeste();
        getHelfer();
    }, []);


    if (!veranstaltung) {
        return (
            <p>loading</p>
        )
    }

    return (
        <Container>

            <PanelGroup accordion bordered>

                <Panel header='Helfer Liste' defaultExpanded>
                    <HelferTable
                        helfer={helfer}
                        getHelfer={getHelfer}
                    />
                    <Button appearance="primary" color="green" onClick={() => { setShowHelferModal(true) }}>Create New</Button>
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
            {showHelferModal &&
                <HelferModal
                    showHelferModal={showHelferModal}
                    setShowHelferModal={setShowHelferModal}
                    v_id={v_id}
                    getHelfer={getHelfer}
                    createGuest={createGuest}
                    helfer={helfer}
                />
            }

        </Container>
    );
}

export default VeranstaltungTeilnehmerTable;