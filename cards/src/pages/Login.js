import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import LoginForm from '../components/LoginForm';

import '../components/Fade.css';

import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState();

    const requestOptions = {
        method: 'GET',
    };

    useEffect(() => {
        const getAuthenticated = async () => await fetch('/session', requestOptions)
            .then(response => {
                setAuthenticated(response.redirected === false);
            });
        getAuthenticated();
        if (authenticated !== undefined && authenticated !== null && authenticated) navigate('/');
    });

    return authenticated === false ? (
        <div className='login'>
            <div className='login-stack'>
                <div className='login-card login-left'></div>
                <div className='login-card login-center'></div>
                <div className='login-card login-right'></div>
            </div>          
            <h1 className='fade first-fade' style={{animationDelay: '0.5s'}}>Cards</h1>
            <LoginForm />
        </div>
    ) : <div></div>;
}