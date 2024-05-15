import { Table, Button, Panel } from 'rsuite';
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table;

const GaesteTable = ({ gaeste, editGuest }) => {

    return (
        <div style={{ paddingLeft: "10px" }}>


            <Table
                autoHeight
                sortColumn={1}
                wordWrap="break-word"
                data={gaeste}
                onRowClick={rowData => {
                    console.log(rowData);
                }}
            >
                <Column flexGrow align="left">
                    <HeaderCell>Name</HeaderCell>
                    <Cell dataKey="g_name" />
                </Column>

                <Column flexGrow align="left" fixed>
                    <HeaderCell>Anmerkung</HeaderCell>
                    <Cell dataKey="anmerkung" />
                </Column>

                <Column width={200} align="center" fixed>
                    <HeaderCell>Status</HeaderCell>
                    <Cell dataKey="zusage">
                        {rowData => (
                            <Button
                            style={{width: 150}}
                            appearance="primary"
                            color={rowData.zusage === 'Zugesagt' ? 'green' : rowData.zusage === 'Abgesagt' ? 'red' : 'yellow'}
                            onClick={() => editGuest(rowData.g_id, rowData.zusage)}
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

export default GaesteTable;