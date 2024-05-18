import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Table, PanelGroup, Button, Panel, Text } from 'rsuite';
import HelferTable from "../Users/HelferTable";
import GaesteTable from "../Gaeste/GaesteTable";
import GuestModal from "../Gaeste/GaesteModal";
import HelferModal from "../Users/HelferModal";
import VeranstaltungAufgabenModal from "./VeranstaltungAufgabenModal";

const { Column, HeaderCell, Cell } = Table;

const VeranstaltungAufgabenTable = () => {
    const params = useParams()
    const navigate = useNavigate()
    const v_id = params.v_id
    const [showModal, setShowModal] = useState(false)
    const [aufgaben, setAufgaben] = useState(null);
    const [helfer, setHelfer] = useState(null);
    const [selectedAufgabe, setSelectedAufgabe] = useState(undefined);
    const [editMode, setEditMode] = useState(null)

    console.log('aufgaben')


    const getData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/aufgaben/${v_id}`)
            const json = await response.json()
            console.log('aufgaben', json)
            setAufgaben(json)
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

    const createAufgabe = async (a_name, a_beschreibung, u_id, v_id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/aufgabe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ a_name, a_beschreibung, v_id, u_id })
            })
            if (response.status === 200) {
                setShowModal(false)
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const editAufgabe = async (a_id, a_name, a_beschreibung, u_id) => {

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/aufgabe/${a_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ a_name, a_beschreibung, u_id })
            })
            console.log(response)
            if (response.status === 200) {
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const deleteAufgabe = async (a_id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/aufgabe/${a_id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(response)
            if (response.status === 200) {
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }



    useEffect(() => {
        getData();
        getHelfer();
    }, []);


    if (!aufgaben) {
        return (
            <p>loading</p>
        )
    }

    return (
        <Panel>

            <Table
                wordWrap="break-word"
                autoHeight={true}
                data={aufgaben}
            >
                <Column flexGrow={60} align="left">
                    <HeaderCell>Id</HeaderCell>
                    <Cell dataKey="a_id" />
                </Column>

                <Column flexGrow={100} align="left">
                    <HeaderCell>Name</HeaderCell>
                    <Cell dataKey="a_name" />
                </Column>

                <Column flexGrow={200} align="left" fixed>
                    <HeaderCell>Beschreibung</HeaderCell>
                    <Cell>
                        {rowData => (
                            <Text as="pre">{rowData.a_beschreibung}</Text>
                        )}
                    </Cell>
                </Column>

                <Column flexGrow={100} align="left">
                    <HeaderCell>Verantwortlicher</HeaderCell>
                    <Cell dataKey="u_email" />
                </Column>

                <Column flexGrow={100} align="right" fixed>
                    <HeaderCell></HeaderCell>

                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <Button style={{ height: 37 }} color="yellow" appearance="primary" onClick={() => { setEditMode(true); setSelectedAufgabe(rowData); setShowModal(true) }}>
                                Edit
                            </Button>
                        )}
                    </Cell>
                </Column>

                <Column flexGrow={100} align="right" fixed >
                    <HeaderCell></HeaderCell>

                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <Button style={{ height: 37 }} color="red" appearance="primary" onClick={() => { deleteAufgabe(rowData.a_id) }}>
                                Delete
                            </Button>
                        )}
                    </Cell>
                </Column>
            </Table>
            <Button style={{ width: 150 }} appearance="primary" color="green" onClick={() => { setShowModal(true); setEditMode(false) }}>Create New</Button>
            {showModal &&
                <VeranstaltungAufgabenModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    v_id={v_id}
                    createAufgabe={createAufgabe}
                    helfer={helfer}
                    selectedAufgabe={selectedAufgabe}
                    editMode={editMode}
                    editAufgabe={editAufgabe}
                />
            }
        </Panel>
    );
}

export default VeranstaltungAufgabenTable;