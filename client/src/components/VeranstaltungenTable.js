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
        <Table
            wordWrap="break-word"
            height={400}
            data={veranstaltungen}
            onRowClick={rowData => {
                console.log(rowData);
            }}
        >
            <Column width={60} align="center" fixed>
                <HeaderCell>Id</HeaderCell>
                <Cell dataKey="v_id" />
            </Column>

            <Column width={200}>
                <HeaderCell>Veranstaltung</HeaderCell>
                <Cell dataKey="v_name" />
            </Column>

            <Column width={200}>
                <HeaderCell>Teilnehmer#</HeaderCell>
                <Cell dataKey="teilnehmer_anzahl" />
            </Column>

            <Column width={200}>
                <HeaderCell>Datum</HeaderCell>
                <Cell dataKey="datum" />
            </Column>

            <Column width={200}>
                <HeaderCell>Veranstalter</HeaderCell>
                <Cell dataKey="u_email" />
            </Column>

            <Column width={200}>
                <HeaderCell>Adresse</HeaderCell>
                <Cell dataKey="ort" />
            </Column>

            <Column width={100} align="right">
                <HeaderCell></HeaderCell>

                <Cell style={{ padding: '6px' }}>
                    {rowData => (
                        <Button appearance="primary" href={`veranstaltung/${rowData.v_id}`}>
                            View Details
                        </Button>
                    )}
                </Cell>
            </Column>

            <Column width={100}  align="right">
                <HeaderCell></HeaderCell>

                <Cell style={{ padding: '6px' }}>
                    {rowData => (
                        <Button color="yellow" appearance="primary" onClick={() => {setEditMode(true); setSelectedVeranstaltung(rowData); setShowModal(true)}}>
                            Edit
                        </Button>
                    )}
                </Cell>
            </Column>

            <Column width={100} align="right" >
                <HeaderCell></HeaderCell>

                <Cell style={{ padding: '6px' }}>
                    {rowData => (
                        <Button color="red" appearance="primary" onClick={() => {deleteVeranstaltung(rowData.v_id)}}>
                            Delete
                        </Button>
                    )}
                </Cell>
            </Column>
        </Table>
    )
};

export default VeranstaltungenTable;