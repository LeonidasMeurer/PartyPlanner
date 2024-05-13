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
        <div style={{paddingLeft: "10px"}}>


            <Table
                height={400}
                data={teilnehmer}
                onRowClick={rowData => {
                    console.log(rowData);
                }}
            >
                <Column width={60} align="center" fixed>
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey="email" />
                </Column>

                <Column width={80} fixed="right">
                    <HeaderCell>...</HeaderCell>

                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <Link appearance="link" to={`veranstaltung/${rowData.v_id}`}>
                                Edit
                            </Link>
                        )}
                    </Cell>
                </Column>
            </Table>
        </div>
    )
};

export default TeilnehmerTable;