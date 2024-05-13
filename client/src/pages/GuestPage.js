import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar, Container, Panel, Text, Heading, PanelGroup, Placeholder } from 'rsuite';
import TeilnehmerTable from "../components/TeilnehmerTable";

const GuestPage = () => {
    const params = useParams()
    const [veranstaltung, setVeranstaltung] = useState(undefined);

    const getData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung/${params.v_id}`)
            const json = await response.json()
            console.log(json[0].v_name)
            setVeranstaltung(json[0])
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
                <Panel header='GästeListe' defaultExpanded>
                    <Heading style={{ paddingBottom: '10px' }} level={3}>{veranstaltung.v_name}</Heading>
                    <Heading level={5}>Datum</Heading>
                    <TeilnehmerTable />
                </Panel>
            </PanelGroup>
        </Container>
    );
}

export default GuestPage;