import { useState, useRef } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import ReCAPTCHA from 'react-google-recaptcha';

import { SITE_KEY, SECRET_KEY } from '../data/reCAPTCHA.js';

import {
    validateUsername, usernameError,
    validatePassword, passwordError,
    Status,
} from '../data/Utility.js';

import './Form.css';

export default function LoginForm() {
    const { state } = useLocation();
    const { target } = state ? state : '/';
    let createAccount = false;

    function handleSignUpClick(e) {
        createAccount = true;
    }

    function handleLogInClick(e) {
        createAccount = false;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        if (createAccount === true) signUp(username, password);
        else logIn(username, password);
    }

    const [error, setError] = useState();
    const [errorStyle, setErrorStyle] = useState();

    const [signUpButtonStyle, setSignUpButtonStyle] = useState({ animationDelay: '0.8s' });
    const [logInButtonStyle, setLogInButtonStyle] = useState({ animationDelay: '0.9s' });

    let signUpButtonClassNames = 'fade fourth-fade form-button';
    let logInButtonClassNames = 'fade fifth-fade form-button';

    function displayErrorMessage() {
        if (error !== '') {
            setErrorStyle({
                animationDelay: '0.8s',
                display: 'block',
            });
            signUpButtonClassNames = 'fade fifth-fade form-button';
            setSignUpButtonStyle({ animationDelay: '0.9s' })
            logInButtonClassNames = 'fade sixth-fade form-button';
            setLogInButtonStyle({ animationDelay: '1s' });
        }
    }

    function hideErrorMessage() {
        if (error === '') {
            setErrorStyle({
                animationDelay: '0.8s',
                display: 'none',
            });
        }
    }

    const navigate = useNavigate();

    function errorHandling(username, password) {
        const validUsername = validateUsername(username);
        if (!validUsername) {
            setError(usernameError(username));
            displayErrorMessage();
            return false;
        }

        const validPassword = validatePassword(password);
        if (!validPassword) {
            setError(passwordError(password));
            displayErrorMessage();
            return false;
        }

        if (error !== '') {
            setError('');
            hideErrorMessage();
        }

        return true;
    }

    const [validToken, setValidToken] = useState([]);

    const captchaREF = useRef(null);

    const verify = async (token) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, secretKey: SECRET_KEY })
        };
        return await fetch('/verify-token', requestOptions)
            .then(response => response.json()).then(data => {
                return data;
            });
    }

    async function signUp(username, password) {
        if (!errorHandling(username, password)) return;

        let token = captchaREF.current.getValue();
        captchaREF.current.reset();

        if (token) {
            let valid = await verify(token);
            setValidToken(valid);

            if (valid.success === true) {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username, password: password })
                };
                await fetch('/signup', requestOptions)
                    .then(response => response.json()).then(data => {
                        if (data.error === undefined) return navigate(target);
                        else {
                            setError('Username is not available');
                            displayErrorMessage();
                        }
                    });
            }
        }
        else {
            setError('Failed reCAPTCHA');
            displayErrorMessage();
        }


    }

    async function logIn(username, password) {
        if (!errorHandling(username, password)) return;

        let token = captchaREF.current.getValue();
        captchaREF.current.reset();

        if (token) {
            let valid = await verify(token);
            setValidToken(valid);

            if (valid.success === true) {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username, password: password })
                };
                await fetch('/login/password', requestOptions)
                    .then(response => response.json()).then(data => {
                        if (data.error === undefined) return navigate(target);
                        else {
                            setError('Incorrect username or password');
                            displayErrorMessage();
                        }
                    });
            }
        }
        else {
            setError('Failed reCAPTCHA');
            displayErrorMessage();
        }
    }



    return (
        <form className="form" id="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <input className='fade second-fade form-input' style={{ animationDelay: '0.6s' }} type="text" name="username" placeholder="Username"></input>
                <input className='fade third-fade form-input' style={{ animationDelay: '0.7s' }} type="password" name="password" placeholder="Password"></input>
            </div>
            <div className="fade fourth-fade form-error" style={errorStyle}>
                {error}
            </div>
            <div className="fade fourth-fade" style={{ animationDelay: '0.8s' }}>
                <ReCAPTCHA className="recaptcha" sitekey={SITE_KEY} ref={captchaREF} />
            </div>
            <div className="form-group">
                <button className={signUpButtonClassNames} style={signUpButtonStyle} type="submit" onClick={handleSignUpClick}>Sign Up</button>
                <button className={logInButtonClassNames} style={logInButtonStyle} type="submit" onClick={handleLogInClick}>Login</button>
            </div>
        </form>
    );
}