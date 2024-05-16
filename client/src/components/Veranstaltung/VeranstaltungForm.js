import { useState } from 'react';
import { DatePicker, Form, InputNumber, Button, ButtonToolbar } from 'rsuite'
import { useCookies } from 'react-cookie';


const VeranstaltungForm = ({ setShowModal, veranstaltung, editMode, getData }) => {
    const [cookies] = useCookies(null);
    const userEmail = cookies.userEmail
    const userId = cookies.userId
    const datum = new Date(veranstaltung?.datum)

    const [formValue, setFormValue] = useState({
        v_name: editMode ? veranstaltung.v_name : null,
        teilnehmer_anzahl: editMode ? veranstaltung.teilnehmer_anzahl : null,
        datum: editMode ? datum : null,
        beschreibung: editMode ? veranstaltung.beschreibung : null,
        u_email: userEmail,
        ort: editMode ? veranstaltung.ort : null,
        u_id: userId,
    })


    const createVeranstaltung = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValue)
            })
            console.log(response)
            if (response.status === 200) {
                setShowModal(false)
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const editVeranstaltung = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung/${veranstaltung.v_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValue)
            })
            console.log(response)
            if (response.status === 200) {
                setShowModal(false)
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }


    const onSubmit = () => {
        if (!editMode) {
            createVeranstaltung()
        } else {
            editVeranstaltung()
        }
    }



    return (
        <>
            <Form
                style={{ width: '800px' }}
                fluid
                formValue={formValue}
                onChange={setFormValue}
            >
                <Form.Group controlId="v_name">
                    <Form.ControlLabel>Veranstaltung</Form.ControlLabel>
                    <Form.Control
                        defaultValue={''}
                        name="v_name"
                    />
                    <Form.HelpText>Required</Form.HelpText>
                </Form.Group>
                <Form.Group controlId="host">
                    <Form.ControlLabel>Host</Form.ControlLabel>
                    <Form.Control
                        defaultValue={userEmail}
                        name="host"
                        readOnly={true}
                    />
                    <Form.HelpText>Required</Form.HelpText>
                </Form.Group>
                <Form.Group controlId="email-1">
                    <Form.ControlLabel>Teilnehmer#</Form.ControlLabel>
                    <Form.Control
                        accepter={InputNumber}
                        defaultValue={0}
                        name="teilnehmer_anzahl"
                    />
                    <Form.HelpText>Required</Form.HelpText>
                </Form.Group>
                <Form.Group controlId="datum">
                    <Form.ControlLabel>Datum & Uhrzeit</Form.ControlLabel>
                    <Form.Control name="datum" accepter={DatePicker} format="MM/dd/yyyy hh:mm" />
                </Form.Group>
                <Form.Group controlId="beschreibung">
                    <Form.ControlLabel>Beschreibung</Form.ControlLabel>
                    <Form.Control
                        defaultValue={''}
                        name="beschreibung"
                    />
                </Form.Group>
                <Form.Group controlId="ort">
                    <Form.ControlLabel>Adresse</Form.ControlLabel>
                    <Form.Control
                        defaultValue={''}
                        name="ort"
                    />
                </Form.Group>
            </Form>
            <ButtonToolbar style={{ marginTop: '10px' }}>
                <Button onClick={() => { onSubmit() }} appearance="primary">
                    Submit
                </Button>
                <Button onClick={() => setShowModal(false)} appearance="subtle">
                    Cancel
                </Button>
            </ButtonToolbar>
        </>
    );
};

export default VeranstaltungForm;