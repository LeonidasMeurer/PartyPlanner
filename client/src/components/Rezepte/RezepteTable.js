import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { Table, Button } from 'rsuite';
import RezeptModal from './RezeptModal';

const { Column, HeaderCell, Cell } = Table;

const RezepteTable = () => {
    const [showModal, setShowModal] = useState()
    const params = useParams()
    const u_id = params.u_id
    const [rezepte, setRezepte ] = useState()
    const [editMode, setEditMode] = useState(false)
    const [selectedRezept, setSelectedRezept] = useState(null)

    console.log('id_id', editMode)

    
    const getData = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVERURL}/rezepte_user/${u_id}`)
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

    const createRezept = async (r_name, r_ernaehrungsform, salzig) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/rezepte`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ r_name, r_ernaehrungsform, u_id, salzig })
            })
            if (response.status === 200) {
                setShowModal(false)
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }


    const deleteRezept = async(r_id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/rezepte/${r_id}`, {
                method: 'DELETE',
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
      }, []);
    
    return (
        <>
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
                <Cell dataKey="salzig"/>
            </Column>

            <Column flexGrow={100} align="right" fixed>
                <HeaderCell></HeaderCell>

                <Cell style={{ padding: '6px' }}>
                    {rowData => (
                        <Button style={{height: 37}} color="yellow" appearance="primary" onClick={() => {setEditMode(true); setSelectedRezept(rowData); setShowModal(true)}}>
                            Edit
                        </Button>
                    )}
                </Cell>
            </Column>

            <Column flexGrow={100} align="right" fixed >
                <HeaderCell></HeaderCell>

                <Cell style={{ padding: '6px' }}>
                    {rowData => (
                        <Button style={{height: 37}} color="red" appearance="primary" onClick={() => {deleteRezept(rowData.r_id)}}>
                            Delete
                        </Button>
                    )}
                </Cell>
            </Column>
        </Table>
        <Button style={{width: 150}} appearance="primary" color="green" onClick={() => { setShowModal(true); setEditMode(false) }}>Create New</Button>

        {showModal &&
          <RezeptModal
            showModal={showModal}
            setShowModal={setShowModal}
            createRezept={createRezept}
            selectedRezept={selectedRezept}
            editMode={editMode}
            getData={getData}
          />
        }

        </>
    )
};

export default RezepteTable;