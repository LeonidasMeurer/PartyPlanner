import { Table, Button } from 'rsuite';
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table;

const HelferTable = ({ helfer, getHelfer }) => {
    const params = useParams();


    console.log('helfer', helfer)

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
        </div>
    )
};

export default HelferTable;