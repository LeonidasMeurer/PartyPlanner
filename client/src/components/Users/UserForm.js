import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button, ButtonToolbar,  Checkbox, Input, Panel, Form } from 'rsuite'
import Ernaehrungsform from '../HelperComponents/Ernaehrungsform';
import { ernaehrungsform_default } from '../HelperComponents/Ernaehrungsform';




const UserForm = () => {
    const [userId, getData, user] = useOutletContext()
    console.log('user', user)
    const [u_ernaehrungsform, setErnaerungsform] = useState(user.u_ernaehrungsform ? user.u_ernaehrungsform : ernaehrungsform_default)
    const [u_email, setEmail] = useState(user.u_email ? user.u_email : '')

    const editUser = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/user/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ u_email, u_ernaehrungsform })
            })
            console.log(response)
            if (response.status === 200) {
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Panel>
            <Form>

                <Form.Group>
                    <Form.ControlLabel>Email:</Form.ControlLabel>
                    <Input
                        value={u_email}
                        onChange={(e) => setEmail(e)} />
                </Form.Group>

                <Form.Group>
                    <Ernaehrungsform ernaehrungsform={u_ernaehrungsform} setErnaerungsform={setErnaerungsform} alergienLabel={'Meine Unverträglichkeiten'}></Ernaehrungsform>
                </Form.Group>

                <ButtonToolbar style={{ marginTop: '10px' }}>
                    <Button onClick={() => { editUser(u_email, u_ernaehrungsform) }} appearance="primary">
                        Save
                    </Button>

                </ButtonToolbar>
            </Form>
        </Panel>
    );
};

export default UserForm;