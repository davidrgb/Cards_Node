import { useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

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
            setSignUpButtonStyle({animationDelay: '0.9s'})
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

    const usernameExpression = /^[a-zA-Z._0-9-]{1,16}$/;
    const passwordExpression = /^[a-zA-Z0-9~`!@#$%^&*()_+={[}\]|\\|:;"'<,>.?/-]{8,32}$/;
    const passwordCharacterExpression = /^[a-zA-Z0-9~`!@#$%^&*()_+={[}\]|\\|:;"'<,>.?/-]$/;

    function validateUsername(username) {
        if (username === undefined || username === null || username.length === 0) return false;
        return usernameExpression.test(username);
    }

    function validatePassword(password) {
        if (password === undefined || password === null || password.length === 0) return false;
        return passwordExpression.test(password);
    }

    function findInvalidCharacter(re, string) {
        for (let i = 0; i < string.length; i++) {
            if (!re.test(string[i])) return { index: i + 1, character: string[i] };
        }
    }

    const navigate = useNavigate();

    function errorHandling(username, password) {
        const validUsername = validateUsername(username);
        if (!validUsername) {
            if (username.length < 1) setError('Username required');
            else if (username.length > 16) setError('Username must be no more than 16 characters');
            else {
                const invalidCharacter = findInvalidCharacter(usernameExpression, username);
                setError(`Invalid character '${invalidCharacter.character}' at position ${invalidCharacter.index} in username`);
            }
            displayErrorMessage();
            return false;
        }

        const validPassword = validatePassword(password);
        if (!validPassword) {
            if (password.length < 8) setError('Password must be at least 8 characters');
            else if (password.length > 32) setError('Password must be no more than 32 characters');
            else {
                const invalidCharacter = findInvalidCharacter(passwordCharacterExpression, password);
                setError(`Invalid character '${invalidCharacter.character}' at position ${invalidCharacter.index} in password`);
            }
            displayErrorMessage();
            return false;
        }

        if (error !== '') {
            setError('');
            hideErrorMessage();
        }

        return true;
    }

    function signUp(username, password) {
        if (!errorHandling(username, password)) return;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        };
        fetch('/signup', requestOptions)
            .then(response => response.json()).then(data => {
                if (data.authenticated === true) return navigate(target);
                setError('Username is not available');
                displayErrorMessage();
            });
    }

    function logIn(username, password) {
        if (!errorHandling(username, password)) return;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        };
        fetch('/login/password', requestOptions)
            .then(response => response.json()).then(data => {
                if (data.authenticated === true) return navigate(target);
                setError('Incorrect username or password');
                displayErrorMessage();
            });
    }

    // Fade classes used for animations on Login page

    return (
        <form className="form" id="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <input className='fade second-fade form-input' style={{ animationDelay: '0.6s' }} type="text" name="username" placeholder="Username"></input>
                <input className='fade third-fade form-input' style={{ animationDelay: '0.7s' }} type="password" name="password" placeholder="Password"></input>
            </div>
            <div className="fade fourth-fade form-error" style={errorStyle}>
                {error}
            </div>
            <div className="form-group">
                <button className={signUpButtonClassNames} style={signUpButtonStyle} type="submit" onClick={handleSignUpClick}>Sign Up</button>
                <button className={logInButtonClassNames} style={logInButtonStyle} type="submit" onClick={handleLogInClick}>Login</button>
            </div>
        </form>
    );
}