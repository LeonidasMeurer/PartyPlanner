import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ButtonToolbar, SelectPicker, CheckboxGroup, Checkbox, Input, Panel, Form } from 'rsuite'

const rezeptTyp = [
    'salzig',
    'süß',
].map(item => ({ label: item, value: item }));

const ernaehrungsform_default = {
    Omnivore: false,
    Vegetarisch: false,
    Vegan: false,
    kein_Alkohol: false,
    Alkohol: false,
    kein_Schweinefleisch: false,
    Lactoseintolerant: false,
    Glutenunverträglich: false
}


const RezeptForm = ({ setShowModal, createRezept, selectedRezept, editMode, getData }) => {
    const [r_ernaehrungsform, setErnaerungsform] = useState(editMode ? selectedRezept.r_ernaehrungsform : ernaehrungsform_default)
    const [r_name, setName] = useState(editMode ? selectedRezept.r_name : '')
    const [salzig, setSalzig] = useState(editMode ? selectedRezept.salzig : 'salzig')


    const changeErnaerungsform = (value) => {
        setErnaerungsform({
            ...r_ernaehrungsform,
            [value]: r_ernaehrungsform[value] === true ? false : true
        })
    }

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

                <Form.Group >
                    <Form.ControlLabel>Ernährung:</Form.ControlLabel>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>

                        <Checkbox
                            defaultChecked={r_ernaehrungsform?.Omnivore}
                            value={"Omnivore"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >Ominvore</Checkbox>
                        <Checkbox
                            defaultChecked={r_ernaehrungsform?.Vegetarisch}
                            value={"Vegetarisch"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >Vegetarisch</Checkbox>
                        <Checkbox
                            defaultChecked={r_ernaehrungsform?.Vegan}
                            value={"Vegan"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >Vegan</Checkbox>
                        <Checkbox
                            defaultChecked={r_ernaehrungsform?.kein_Alkohol}
                            value={"kein_Alkohol"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >kein_Alkohol</Checkbox>
                        <Checkbox
                            defaultChecked={r_ernaehrungsform?.Alkohol}
                            value={"Alkohol"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >Alkohol</Checkbox>
                        <Checkbox
                            defaultChecked={r_ernaehrungsform?.kein_Schweinefleisch}
                            value={"kein_Schweinefleisch"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >kein_Schweinefleisch</Checkbox>
                        <Checkbox
                            defaultChecked={r_ernaehrungsform?.Lactoseintolerant}
                            value={"Lactoseintolerant"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >Lactoseintolerant</Checkbox>
                        <Checkbox
                            defaultChecked={r_ernaehrungsform?.Glutenunverträglich}
                            value={"Glutenunverträglich"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >Glutenunverträglich</Checkbox>
                    </div>
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