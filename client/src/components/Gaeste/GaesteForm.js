import { useState } from 'react';
import { Button, ButtonToolbar, SelectPicker, CheckboxGroup, Checkbox, Input, Panel, Form } from 'rsuite'
import Ernaehrungsform from '../HelperComponents/Ernaehrungsform';
import { ernaehrungsform_default } from '../HelperComponents/Ernaehrungsform';



const zusageData = [
    'Zugesagt',
    'Abgesagt',
    'keine Antwort'
].map(item => ({ label: item, value: item }));



const GuestForm = ({ setShowModal, v_id, createGuest }) => {
    const [zusage, setZusage] = useState(null)
    const [anmerkung, setAnmerkung] = useState('')
    const [g_ernaehrungsform, setErnaerungsform] = useState(ernaehrungsform_default)
    const [g_name, setName] = useState('')


    return (

        <Panel>
            <Form>

                <Form.Group>
                    <Form.ControlLabel>Name:</Form.ControlLabel>
                    <Input
                        value={g_name}
                        onChange={(e) => setName(e)} />
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

                <Form.Group>
                    <Form.ControlLabel>Anmerkung:</Form.ControlLabel>
                    <Input
                        as='textarea'
                        value={anmerkung}
                        onChange={(e) => setAnmerkung(e)} />
                </Form.Group>

                <Form.Group>
                    <Ernaehrungsform ernaehrungsform={g_ernaehrungsform} setErnaerungsform={setErnaerungsform} alergienLabel={'Meine Unveträglichkeiten'}/>
                </Form.Group>

                <ButtonToolbar style={{ marginTop: '10px' }}>
                    <Button onClick={() => { createGuest(g_name, zusage, anmerkung, g_ernaehrungsform, v_id) }} appearance="primary">
                        Submit
                    </Button>
                    <Button onClick={() => setShowModal(false)} appearance="subtle">
                        Cancel
                    </Button>
                </ButtonToolbar>
            </Form>
        </Panel>
    );
};

export default GuestForm;