import { useState } from 'react';
import { Button, ButtonToolbar, SelectPicker, CheckboxGroup, Checkbox, Input } from 'rsuite'

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



const GuestForm = ({ setShowModal, v_id, createGuest }) => {
    const [zusage, setZusage] = useState(null)
    const [anmerkung, setAnmerkung] = useState('')
    const [g_ernaehrungsform, setErnaerungsform] = useState(ernaehrungsform_default)
    const [g_name, setName] = useState('')

    const changeErnaerungsform = (value) => {
        setErnaerungsform({
            ...g_ernaehrungsform,
            [value]: g_ernaehrungsform[value] === true ? false : true
        })
    }
    
    return (
        <>
            <Input
            value={g_name}
            onChange={(e) => setName(e)} />
            <SelectPicker
                data={zusageData}
                searchable={false}
                style={{ width: 300 }}
                placeholder="Zugesagt"
                onChange={(e) => { setZusage(e) }}
            />
            <Input
            value={anmerkung}
            onChange={(e) => setAnmerkung(e)} />
            <CheckboxGroup name="checkbox-group">
                <Checkbox
                    value={"Omnivore"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Ominvore</Checkbox>
                <Checkbox
                    value={"Vegetarisch"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Vegetarisch</Checkbox>
                <Checkbox
                    value={"Vegan"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Vegan</Checkbox>
                <Checkbox
                    value={"kein_Alkohol"}
                    onChange={(value) => changeErnaerungsform(value)}
                >kein_Alkohol</Checkbox>
                <Checkbox
                    value={"kein_Schweinefleisch"}
                    onChange={(value) => changeErnaerungsform(value)}
                >kein_Schweinefleisch</Checkbox>
                <Checkbox
                    value={"Lactoseintolerant"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Lactoseintolerant</Checkbox>
                <Checkbox
                    value={"Glutenunverträglich"}
                    onChange={(value) => changeErnaerungsform(value)}
                >Glutenunverträglich</Checkbox>
            </CheckboxGroup>
            <ButtonToolbar style={{ marginTop: '10px' }}>
                <Button onClick={() => { createGuest(g_name, zusage, anmerkung, g_ernaehrungsform, v_id) }} appearance="primary">
                    Submit
                </Button>
                <Button onClick={() => setShowModal(false)} appearance="subtle">
                    Cancel
                </Button>
            </ButtonToolbar>
        </>
    );
};

export default GuestForm;