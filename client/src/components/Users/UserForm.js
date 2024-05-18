import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button, ButtonToolbar,  Checkbox, Input, Panel, Form } from 'rsuite'

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


const UserForm = () => {
    const [userId, getData, user] = useOutletContext()
    console.log('user', user)
    const [u_ernaehrungsform, setErnaerungsform] = useState(user.u_ernaehrungsform ? user.u_ernaehrungsform : ernaehrungsform_default)
    const [u_email, setEmail] = useState(user.u_email ? user.u_email : '')

    const changeErnaerungsform = (value) => {
        setErnaerungsform({
            ...u_ernaehrungsform,
            [value]: u_ernaehrungsform[value] === true ? false : true
        })
    }

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

                <Form.Group >
                    <Form.ControlLabel>Ernährung:</Form.ControlLabel>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Checkbox
                            defaultChecked={user?.u_ernaehrungsform?.Omnivore}
                            value={"Omnivore"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >Ominvore</Checkbox>
                        <Checkbox
                            defaultChecked={user?.u_ernaehrungsform?.Vegetarisch}
                            value={"Vegetarisch"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >Vegetarisch</Checkbox>
                        <Checkbox
                            defaultChecked={user?.u_ernaehrungsform?.Vegan}
                            value={"Vegan"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >Vegan</Checkbox>
                        <Checkbox
                            defaultChecked={user?.u_ernaehrungsform?.kein_Alkohol}
                            value={"kein_Alkohol"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >kein_Alkohol</Checkbox>
                        <Checkbox
                            defaultChecked={user?.u_ernaehrungsform?.Alkohol}
                            value={"Alkohol"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >Alkohol</Checkbox>
                        <Checkbox
                            defaultChecked={user?.u_ernaehrungsform?.kein_Schweinefleisch}
                            value={"kein_Schweinefleisch"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >kein_Schweinefleisch</Checkbox>
                        <Checkbox
                            defaultChecked={user?.u_ernaehrungsform?.Lactoseintolerant}
                            value={"Lactoseintolerant"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >Lactoseintolerant</Checkbox>
                        <Checkbox
                            defaultChecked={user?.u_ernaehrungsform?.Glutenunverträglich}
                            value={"Glutenunverträglich"}
                            onChange={(value) => changeErnaerungsform(value)}
                        >Glutenunverträglich</Checkbox>
                    </div>
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