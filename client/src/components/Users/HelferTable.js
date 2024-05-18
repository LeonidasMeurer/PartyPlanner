import { Table, Button } from 'rsuite';
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import HelferModal from './HelferModal';

const { Column, HeaderCell, Cell } = Table;

const HelferTable = ({helfer, getHelfer}) => {
    const params = useParams();
/*     const [helfer, setHelfer] = useState(undefined); */
    const [showHelferModal, setShowHelferModal] = useState(false)


    
    /* const getHelfer = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung_helfer/${params.v_id}`)
            const json = await response.json()
            console.log('setHelfer', json)
            setHelfer(json)
            return json;
        } catch (err) {
            console.error(err)
        }
    } */

    const createHelfer = async (u_email, zusage) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung_helfer/${params.v_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ u_email, zusage})
            })
            console.log('createHelfer', response.rows)
            if (response.status === 200) {
                setShowHelferModal(false)
                getHelfer()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const editHelfer = async (u_id, zusage) => {
        if (zusage === 'keine Antwort' || zusage === 'Abgesagt') {
            zusage = 'Zugesagt'
        } else {
            zusage = 'Abgesagt'
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/helfer/${params.v_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ u_id, zusage })
            })
            console.log(response)
            if (response.status === 200) {
                getHelfer()
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getHelfer();
    }, []);

    return (
        <div style={{ paddingLeft: "10px" }}>
            <Table
                autoHeight
                wordWrap="break-word"
                data={helfer}
                onRowClick={rowData => {
                    console.log(rowData);
                }}
            >
                <Column flexGrow align="left">
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey="u_email" />
                </Column>

                <Column width={200} align="center">
                    <HeaderCell>Status</HeaderCell>
                    <Cell dataKey="zusage">
                        {rowData => (
                            <Button
                                style={{ width: 150 }}
                                appearance="primary"
                                color={rowData.zusage === 'Zugesagt' ? 'green' : rowData.zusage === 'Abgesagt' ? 'red' : 'yellow'}
                                onClick={() => editHelfer(rowData.u_id, rowData.zusage)}
                            >
                                {rowData.zusage === 'Zugesagt' ? 'Zugesagt' : rowData.zusage === 'Abgesagt' ? 'Abgesagt' : 'keine Antwort'}
                            </Button>
                        )}
                    </Cell>
                </Column>
            </Table>
            {showHelferModal &&
                <HelferModal
                    showHelferModal={showHelferModal}
                    setShowHelferModal={setShowHelferModal}
                    createHelfer={createHelfer}
                    helfer={helfer}
                />
            }
        </div>
    )
};

export default HelferTable;