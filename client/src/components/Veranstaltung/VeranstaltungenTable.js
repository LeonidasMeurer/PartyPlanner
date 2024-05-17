import { Table, Button } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const VeranstaltungenTable = ({setSelectedVeranstaltung, setShowModal, veranstaltungen, setEditMode, getData}) => {


    const deleteVeranstaltung = async(v_id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung/${v_id}`, {
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
    
    
    return (
        <>
        <Table
            rowHeight={50}
            autoHeight
            data={veranstaltungen}
        >
            <Column flexGrow={60} align="left">
                <HeaderCell>Id</HeaderCell>
                <Cell dataKey="v_id" />
            </Column>

            <Column flexGrow={200} align="left">
                <HeaderCell>Veranstaltung</HeaderCell>
                <Cell dataKey="v_name" />
            </Column>

            <Column  flexGrow={100} align="left">
                <HeaderCell>Teilnehmer#</HeaderCell>
                <Cell dataKey="teilnehmer_anzahl" />
            </Column>

            <Column flexGrow={200} align="left">
                <HeaderCell>Datum</HeaderCell>
                <Cell dataKey="datum" />
            </Column>

            <Column flexGrow={150} align="left">
                <HeaderCell>Veranstalter</HeaderCell>
                <Cell dataKey="u_email" />
            </Column>

            <Column flexGrow={150} align="left">
                <HeaderCell>Adresse</HeaderCell>
                <Cell dataKey="ort" />
            </Column>

            <Column flexGrow={150} align="right" fixed>
                <HeaderCell></HeaderCell>

                <Cell style={{ padding: '6px' }}>
                    {rowData => (
                        <Button style={{height: 37}} appearance="primary" href={`veranstaltung/${rowData.v_id}`}>
                            View Details
                        </Button>
                    )}
                </Cell>
            </Column>

            <Column flexGrow={100} align="right" fixed>
                <HeaderCell></HeaderCell>

                <Cell style={{ padding: '6px' }}>
                    {rowData => (
                        <Button style={{height: 37}} color="yellow" appearance="primary" onClick={() => {setEditMode(true); setSelectedVeranstaltung(rowData); setShowModal(true)}}>
                            Edit
                        </Button>
                    )}
                </Cell>
            </Column>

            <Column flexGrow={100} align="right" fixed >
                <HeaderCell></HeaderCell>

                <Cell style={{ padding: '6px' }}>
                    {rowData => (
                        <Button style={{height: 37}} color="red" appearance="primary" onClick={() => {deleteVeranstaltung(rowData.v_id)}}>
                            Delete
                        </Button>
                    )}
                </Cell>
            </Column>
        </Table>
        <Button style={{width: 150}} appearance="primary" color="green" onClick={() => { setShowModal(true); setEditMode(false) }}>Create New</Button>
        </>
    )
};

export default VeranstaltungenTable;