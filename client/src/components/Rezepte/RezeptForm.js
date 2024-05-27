import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ButtonToolbar, SelectPicker, CheckboxGroup, Checkbox, Input, Panel, Form } from 'rsuite'
import Ernaehrungsform from '../HelperComponents/Ernaehrungsform';
import { ernaehrungsform_default } from '../HelperComponents/Ernaehrungsform';


const rezeptTyp = [
    'salzig',
    'süß',
].map(item => ({ label: item, value: item }));



const RezeptForm = ({ setShowModal, createRezept, selectedRezept, editMode, getData }) => {
    const [r_ernaehrungsform, setErnaerungsform] = useState(editMode ? selectedRezept.r_ernaehrungsform : ernaehrungsform_default)
    const [r_name, setName] = useState(editMode ? selectedRezept.r_name : '')
    const [salzig, setSalzig] = useState(editMode ? selectedRezept.salzig : 'salzig')

    const editRezept = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/rezepte/${selectedRezept.r_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ r_name, r_ernaehrungsform, salzig })
            })
            console.log(response)
            if (response.status === 200) {
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const onSubmit = () => {
        if (!editMode) {
            createRezept(r_name, r_ernaehrungsform, salzig)
        } else {
            editRezept()
        }
        setShowModal(false)
    }

    return (
        <Panel>
            <Form>

                <Form.Group>
                    <Form.ControlLabel>Name:</Form.ControlLabel>
                    <Input
                        value={r_name}
                        onChange={(e) => setName(e)} />
                </Form.Group>

                <Form.Group>
                    <Form.ControlLabel>Typ</Form.ControlLabel>
                <SelectPicker
                    data={rezeptTyp}
                    defaultValue={salzig}
                    searchable={false}
                    style={{ width: 300 }}
                    onChange={(e) => { setSalzig(e) }}
                />
                </Form.Group>

                <Form.Group>
                    <Ernaehrungsform ernaehrungsform={r_ernaehrungsform} setErnaerungsform={setErnaerungsform} alergienLabel={'Geeignet für Personen mit:'}></Ernaehrungsform>
                </Form.Group>
                <ButtonToolbar style={{ marginTop: '10px' }}>
                    <Button onClick={() => { onSubmit() }} appearance="primary">
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

export default RezeptForm;