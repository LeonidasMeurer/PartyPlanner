import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ButtonToolbar, SelectPicker, Panel, Form, InputNumber } from 'rsuite'


const VeranstaltungRezepteForm = ({ setShowModal, selectedRezept, editMode, getData, userRezepte }) => {
    const params = useParams()
    const oldRezeptId = selectedRezept?.r_id
    const v_id = params.v_id
    const [portionen, setPortionen] = useState(editMode ? selectedRezept.portionen : null)
    const [r_id, setRezeptId] = useState(editMode ? selectedRezept.r_id : null)
    const [r_name, setRezeptName] = useState(editMode ? selectedRezept.r_name : null)


    console.log(editMode)

    const userRezepteParsed = userRezepte.map((item) => {
        return {
            label: item.r_name,
            value: item.r_name,
            r_id: item.r_id
        }
    })

    const changeRezept = (e) => {
        const result = userRezepteParsed.filter(item => {
            return item.label === e
          })
          setRezeptId(result[0].r_id)
    }

    const rezept_to_veranstaltung = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/rezept_to_veranstaltung/${v_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ r_id, portionen })
            })
            if (response.status === 200) {
                setShowModal(false)
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const editRezeptVeranstaltung = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/rezepte_veranstaltung/${oldRezeptId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ portionen, new_r_id: r_id , v_id })
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
            rezept_to_veranstaltung()
        } else {
            editRezeptVeranstaltung()
        }
        setShowModal(false)
    }


    return (
        <Panel>
            <Form>
                <Form.Group controlId="Portionen">
                    <Form.ControlLabel>Portionen</Form.ControlLabel>
                    <Form.Control
                        accepter={InputNumber}
                        defaultValue={0}
                        value={portionen}
                        onChange={(e) => setPortionen(e)}
                    ></Form.Control>
                    <Form.HelpText>Required</Form.HelpText>
                </Form.Group>

                <Form.Group>
                    <Form.ControlLabel>Meine Rezepte</Form.ControlLabel>
                <SelectPicker
                    data={userRezepteParsed}
                    defaultValue={r_name}
                    searchable={false}
                    style={{ width: 300 }}
                    onChange={(e) => { changeRezept(e); console.log('TEST', e) }}
                />
                </Form.Group>

                <ButtonToolbar style={{ marginTop: '10px' }}>
                    <Button onClick={() => { onSubmit()}} appearance="primary">
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

export default VeranstaltungRezepteForm;