import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Button, Form, ButtonToolbar } from 'rsuite';
import { useNavigate } from 'react-router-dom';


const Auth = () => {
    const [cookies, setCookie] = useCookies(null);
    const authToken = cookies.authToken
    const [isLogIn, setisLogIn] = useState(true);
    const [u_email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        if (authToken) {
          navigate('/', { replace: true });
        }
      }, [navigate, authToken])

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

        if (isLogIn && !u_email) {
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
            body: JSON.stringify({ u_email, password })
        })

        const data = await response.json()

        if (data.detail) {
            setError(data.detail)
        } else {
            setCookie('userEmail', data.u_email)
            setCookie('authToken', data.token)
            setCookie('userId', data.userId)
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
                <Form.Group controlId="u_email">
                    <Form.ControlLabel>Email</Form.ControlLabel>
                    <Form.Control
                        defaultValue={''}
                        name='u_email'
                        type="u_email"
                        placeholder='Email'
                        onChange={(value) => setEmail(value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="Password">
                    <Form.ControlLabel>Password</Form.ControlLabel>
                    <Form.Control
                        defaultValue={''}
                        name="password"
                        type="password"
                        autoComplete="off"
                        placeholder='Password'
                        onChange={(value) => setPassword(value)} />
                </Form.Group>
                {!isLogIn && <Form.Group controlId="confirmPassword">
                    <Form.ControlLabel>Password</Form.ControlLabel>
                    <Form.Control
                        defaultValue={''}
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