import { useEffect, useState, forwardRef } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { Button, ButtonToolbar, SelectPicker, CheckboxGroup, Checkbox, Input, Panel, Form } from 'rsuite'

const zusageData = [
    'Zugesagt',
    'Abgesagt',
    'keine Antwort'
].map(item => ({ label: item, value: item }));

const Textarea = forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const VeranstaltungAufgabenForm = ({ setShowModal, createAufgabe, helfer }) => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const u_email = cookies.userEmail
    const [zusage, setZusage] = useState(null)
    const [a_name, setName] = useState('')
    const [beschreibung, setBeschreibung] = useState('')
    const [u_id, setSelectedHelferId] = useState(cookies.userId)
    const params = useParams()
    const v_id = params.v_id



    const helferParsed = helfer.map((item) => {
        return {
            label: item.u_email,
            value: item.u_email,
            r_id: item.u_id
        }
    })

    console.log(helfer)
    console.log(helferParsed)

    const changeHelfer = (e) => {
        const result = helferParsed.filter(item => {
            return item.label === e
        })
        setSelectedHelferId(result[0].r_id)
    }


    return (

        <Panel>
            <Form>

                <Form.Group>
                    <Form.ControlLabel>Name:</Form.ControlLabel>
                    <Input
                        value={a_name}
                        onChange={(e) => setName(e)} />
                </Form.Group>

                <Form.Group controlId="beschreibung">
                    <Form.ControlLabel>Beschreibung</Form.ControlLabel>
                    <Form.Control
                        rows={5}
                        accepter={Textarea}
                        defaultValue={''}
                        name="beschreibung"
                        onChange={(e) => setBeschreibung(e)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.ControlLabel>Meine Helfer</Form.ControlLabel>
                    <SelectPicker
                        data={helferParsed}
                        defaultValue={u_email}
                        searchable={false}
                        style={{ width: 300 }}
                        onChange={(e) => { changeHelfer(e); console.log('TEST', e) }}
                    />
                </Form.Group>

                <ButtonToolbar style={{ marginTop: '10px' }}>
                    <Button onClick={() => { createAufgabe(a_name, beschreibung, u_id, v_id) }} appearance="primary">
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

export default VeranstaltungAufgabenForm;