import { Table, Button } from 'rsuite';
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react';
import { Link, useParams, useOutletContext } from 'react-router-dom';
import VeranstaltungFrom from './VeranstaltungForm';


const VeranstaltungDashboard = () => {
    const veranstaltung = useOutletContext()
    const params = useParams();
    console.log(veranstaltung[0])


    if (!veranstaltung) {
        return (<></>)
    }

    return (
        <div style={{paddingLeft: "20px", paddingTop: '20px'}}>
           <VeranstaltungFrom
                veranstaltung={veranstaltung[0]}
                editMode={true}
            />
        </div>
    )
};

export default VeranstaltungDashboard;