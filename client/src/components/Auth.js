import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button, Form, Input, ButtonToolbar } from 'rsuite';


const Auth = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const [isLogIn, setisLogIn] = useState(true);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [error, setError] = useState(null);

    console.log(cookies)

    const viewLogin = (status) => {
        setError(null)
        setisLogIn(status)
    }

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault()
        if (!isLogIn && password !== confirmPassword) {
            setError('Make sure passwords match!')
            return
        }

        if (isLogIn && !email) {
            setError('Email required!')
            return
        }

        if (isLogIn && !password) {
            setError('Password required!')
            return
        }

        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (data.detail) {
            setError(data.detail)
        } else {
            setCookie('userEmail', data.email)
            setCookie('authToken', data.token)
        }
    }


    return (
        <div style={{ marginLeft: '20px' }}>

            <h3 style={{ marginBottom: '20px', marginTop: '20px' }}>
                {isLogIn ? "Please log in!" : "Please sign up!"}
            </h3>
            <Form fluid>

                <Form.Group>
                    <ButtonToolbar>
                        <Button
                            onClick={() => viewLogin(false)}
                            appearance={!isLogIn ? 'ghost' : 'default'}
                        >Sign Up</Button>
                        <Button

                            onClick={() => viewLogin(true)}
                            appearance={isLogIn ? 'ghost' : 'default'}
                        >Login</Button>
                    </ButtonToolbar>
                </Form.Group>
                <Form.Group controlId="Email">
                    <Form.ControlLabel>Email</Form.ControlLabel>
                    <Form.Control
                        name='email'
                        type="email"
                        placeholder='Email'
                        onChange={(value) => setEmail(value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="Password">
                    <Form.ControlLabel>Password</Form.ControlLabel>
                    <Form.Control
                        name="password"
                        type="password"
                        autoComplete="off"
                        placeholder='Password'
                        onChange={(value) => setPassword(value)} />
                </Form.Group>
                {!isLogIn && <Form.Group controlId="confirmPassword">
                    <Form.ControlLabel>Password</Form.ControlLabel>
                    <Form.Control
                        name="confirmPassword"
                        type="password"
                        autoComplete="off"
                        placeholder='confirm Password'
                        onChange={(e) => setConfirmPassword(e)} />
                </Form.Group>}
                {error && <p>{error}</p>}
                <Form.Group>
                    <ButtonToolbar >
                        <Button appearance="primary" type='submit' onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')}>Submit</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form>
        </div>
    )
}

export default Auth;