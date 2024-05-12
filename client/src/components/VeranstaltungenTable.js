import { Table, Button } from 'rsuite';
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table;

const VeranstaltungenTable = () => {
    const [ cookies, setCookie, removeCookie ] = useCookies(null);
    const authToken = cookies.authToken
    const userEmail = cookies.userEmail
    const [veranstaltungen, setVeranstaltungen ] = useState(undefined);
    console.log(userEmail)

    const getData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltungen/${userEmail}`)
            const json = await response.json()
            console.log(json)
            setVeranstaltungen(json)
            return json;
        } catch (err) {
            console.error(err)
        }
    }


    useEffect(() => {
        getData();
    }, []);
    console.log("veranstaltung: ", veranstaltungen)


 
    
    return (
        <Table
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

            <Column width={150}>
                <HeaderCell>Veranstaltung</HeaderCell>
                <Cell dataKey="v_name" />
            </Column>

            <Column width={150}>
                <HeaderCell>Teilnehmer#</HeaderCell>
                <Cell dataKey="teilnehmer_anzahl" />
            </Column>

            <Column width={300}>
                <HeaderCell>Datum</HeaderCell>
                <Cell dataKey="datum" />
            </Column>

            <Column width={100}>
                <HeaderCell>Veranstalter</HeaderCell>
                <Cell dataKey="host" />
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
    )
};

export default VeranstaltungenTable;