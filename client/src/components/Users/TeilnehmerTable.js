import { Table, Button } from 'rsuite';
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table;

const TeilnehmerTable = () => {
    const [teilnehmer, setTeilnehmer] = useState(undefined);
    const params = useParams();

    const getData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung_teilnehmer/${params.v_id}`)
            const json = await response.json()
            console.log(json)
            setTeilnehmer(json)
            return json;
        } catch (err) {
            console.error(err)
        }
    }


    useEffect(() => {
        getData();
    }, []);
    console.log("veranstaltung: ", teilnehmer)




    return (
        <div style={{ paddingLeft: "10px" }}>


            <Table
                autoHeight
                wordWrap="break-word"
                data={teilnehmer}
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
                            style={{width: 150}}
                            appearance="primary"
                            color={rowData.zusage === 'Zugesagt' ? 'green' : rowData.zusage === 'Abgesagt' ? 'red' : 'yellow'}
                            >
                                {rowData.zusage === 'Zugesagt' ? 'Zugesagt' : rowData.zusage === 'Abgesagt' ? 'Abgesagt' : 'keine Antwort'}
                            </Button>
                        )}
                    </Cell>
                </Column>

               
            </Table>
        </div>
    )
};

export default TeilnehmerTable;