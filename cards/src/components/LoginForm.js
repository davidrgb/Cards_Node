import { useState, useRef } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import ReCAPTCHA from 'react-google-recaptcha';

import { SITE_KEY, SECRET_KEY } from '../data/reCAPTCHA.js';

import {
    validateUsername, usernameError,
    validatePassword, passwordError,
} from '../data/Utility.js';

import './Form.css';

export default function LoginForm() {
    const { state } = useLocation();
    const { target } = state ? state : '/';

    const [createAccount, setCreateAccount] = useState(false);
    const [inputDisabled, setInputDisabled] = useState(false);

    function handleSignUpClick() {
        setCreateAccount(true);
    }

    function handleLogInClick() {
        setCreateAccount(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setInputDisabled(true);
        const username = e.target.username.value;
        const password = e.target.password.value;
        if (createAccount === true) signUp(username, password);
        else logIn(username, password);
    }

    const [error, setError] = useState();
    const [errorStyle, setErrorStyle] = useState();

    function displayErrorMessage() {
        if (error !== '') {
            setErrorStyle({
                display: 'block',
            });
        }
    }

    function hideErrorMessage() {
        if (error === '') {
            setErrorStyle({
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
        if (!errorHandling(username, password)) {
            setInputDisabled(false);
            return;
        }

        const token = captchaREF.current.getValue();
        captchaREF.current.reset();

        if (token) {
            const valid = await verify(token);

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
                            setInputDisabled(false);
                        }
                    });
            }
        }
        else {
            setError('Failed reCAPTCHA');
            displayErrorMessage();
            setInputDisabled(false);
        }


    }

    async function logIn(username, password) {
        if (!errorHandling(username, password)) {
            setInputDisabled(false);
            return;
        }

        const token = captchaREF.current.getValue();
        captchaREF.current.reset();


        if (token) {
            const valid = await verify(token);

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
                            setInputDisabled(false);
                        }
                    });
            }
        }
        else {
            setError('Failed reCAPTCHA');
            displayErrorMessage();
            setInputDisabled(false);
        }
    }



    return (
        <form className="form" id="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <input className='fade second-fade form-input' style={{ animationDelay: '0.6s' }} type="text" name="username" placeholder="Username" readOnly={inputDisabled} maxlength="16"></input>
                <input className='fade third-fade form-input' style={{ animationDelay: '0.7s' }} type="password" name="password" placeholder="Password" readOnly={inputDisabled} maxlength="32"></input>
            </div>
            <div className="fade fourth-fade form-error" style={errorStyle}>
                {error}
            </div>
            <div className="fade fourth-fade" style={{ animationDelay: '0.8s' }}>
                <ReCAPTCHA className="recaptcha" sitekey={SITE_KEY} ref={captchaREF} theme='dark' />
            </div>
            <div className="form-group">
                <button className="fade fourth-fade form-button" style={{ animationDelay: '0.9s' }} type="submit" onClick={handleSignUpClick} disabled={inputDisabled}>Sign Up</button>
                <button className="fade fourth-fade form-button" style={{ animationDelay: '1s' }} type="submit" onClick={handleLogInClick} disabled={inputDisabled}>Login</button>
            </div>
        </form>
    );
}