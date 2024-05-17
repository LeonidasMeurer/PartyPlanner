import { useState } from 'react';
import { Button, ButtonToolbar, SelectPicker, CheckboxGroup, Checkbox, Input, Panel, Form } from 'rsuite'

const zusageData = [
    'Zugesagt',
    'Abgesagt',
    'keine Antwort'
].map(item => ({ label: item, value: item }));

const ernaehrungsform_default = {
    Omnivore: false,
    Vegetarisch: false,
    Vegan: false,
    kein_Alkohol: false,
    kein_Schweinefleisch: false,
    Lactoseintolerant: false,
    Glutenunverträglich: false
}



const HelferForm = ({ setShowHelferModal, v_id, getHelfer }) => {
    const [zusage, setZusage] = useState(null)
    const [anmerkung, setAnmerkung] = useState('')
    const [g_ernaehrungsform, setErnaerungsform] = useState(ernaehrungsform_default)
    const [u_email, setEmail] = useState('')


    const createHelfer = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/veranstaltung_helfer/${v_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ u_email, zusage})
            })
            if (response.status === 200) {
                setShowHelferModal(false)
                getHelfer()
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (

        <Panel>
            <Form>

                <Form.Group>
                    <Form.ControlLabel>Name:</Form.ControlLabel>
                    <Input
                        value={u_email}
                        onChange={(e) => setEmail(e)} />
                </Form.Group>

                <Form.Group>
                    <Form.ControlLabel>Status</Form.ControlLabel>
                    <SelectPicker
                        data={zusageData}
                        searchable={false}
                        style={{ width: 300 }}
                        placeholder="Zugesagt"
                        onChange={(e) => { setZusage(e) }}
                    />
                </Form.Group>

                <ButtonToolbar style={{ marginTop: '10px' }}>
                    <Button onClick={() => { createHelfer(u_email, zusage) }} appearance="primary">
                        Submit
                    </Button>
                    <Button onClick={() => setShowHelferModal(false)} appearance="subtle">
                        Cancel
                    </Button>
                </ButtonToolbar>
            </Form>
        </Panel>
    );
};

export default HelferForm;