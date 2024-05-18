import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { Table, Button, Panel } from 'rsuite';
import VeranstaltungRezepteModal from './VeranstaltungRezepteModal';
import { useCookies } from 'react-cookie';

const { Column, HeaderCell, Cell } = Table;

const VeranstaltungRezepteTable = () => {
    const [showModal, setShowModal] = useState()
    const params = useParams()
    const v_id = params.v_id
    const [cookies, setCookie, removeCookie] = useCookies()
    const u_id = cookies.userId
    const [rezepte, setRezepte] = useState()
    const [userRezepte, setUserRezepte] = useState()
    const [editMode, setEditMode] = useState(false)
    const [selectedRezept, setSelectedRezept] = useState(null)

    console.log('id_id', v_id)


    const getData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/rezepte_veranstaltung/${v_id}`)
            const json = await response.json()
            console.log(json)
            console.log('test')
            setRezepte(json)
            console.log(rezepte)
            return json;
        } catch (err) {
            console.error(err)
        }
    }

    const getUserRezepte = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVERURL}/rezepte_user/${u_id}`)
          const json = await response.json()
          console.log(u_id)
          console.log('test', json)
          setUserRezepte(json)
          console.log(rezepte)
          return json;
        } catch (err) {
          console.error(err)
        }
    }


    const deleteRezept = async (r_id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/rezepte_veranstaltung/${r_id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ v_id })
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
        getUserRezepte();
    }, []);

    if (!rezepte || !userRezepte) {
        return (
            <p>loading</p>
        )
    }

    return (
        <Panel>
            <Table
                rowHeight={50}
                autoHeight
                data={rezepte}
            >
                <Column flexGrow={60} align="left">
                    <HeaderCell>Id</HeaderCell>
                    <Cell dataKey="r_id" />
                </Column>

                <Column flexGrow={100} align="left">
                    <HeaderCell>Name</HeaderCell>
                    <Cell dataKey="r_name" />
                </Column>

                <Column flexGrow={100} align="left">
                    <HeaderCell>Typ</HeaderCell>
                    <Cell dataKey="salzig" />
                </Column>

                <Column flexGrow={100} align="left">
                    <HeaderCell>Portionen</HeaderCell>
                    <Cell dataKey="portionen" />
                </Column>

                <Column flexGrow={100} align="left">
                    <HeaderCell>Verantwortlicher</HeaderCell>
                    <Cell dataKey="u_email" />
                </Column>

                <Column flexGrow={100} align="right" fixed>
                    <HeaderCell></HeaderCell>

                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <Button style={{ height: 37 }} color="yellow" appearance="primary" onClick={() => { setEditMode(true); setSelectedRezept(rowData); setShowModal(true) }}>
                                Edit
                            </Button>
                        )}
                    </Cell>
                </Column>

                <Column flexGrow={100} align="right" fixed >
                    <HeaderCell></HeaderCell>

                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <Button style={{ height: 37 }} color="red" appearance="primary" onClick={() => { deleteRezept(rowData.r_id) }}>
                                Delete
                            </Button>
                        )}
                    </Cell>
                </Column>
            </Table>
            <Button style={{ width: 150 }} appearance="primary" color="green" onClick={() => { setShowModal(true); setEditMode(false) }}>Create New</Button>

            {showModal &&
                <VeranstaltungRezepteModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    selectedRezept={selectedRezept}
                    editMode={editMode}
                    getData={getData}
                    userRezepte={userRezepte}
                    />
            }


        </Panel>
    )
};

export default VeranstaltungRezepteTable;