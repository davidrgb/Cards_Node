import '../../package.json';

import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Loading from '../components/Loading';
import LoginForm from '../components/LoginForm';

import '../components/Fade.css';

import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState();
    const [version, setVersion] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const firstRun = async () => {
            await fetch('/session')
                .then(response => {
                    setAuthenticated(response.redirected === false);
                });
            
            await fetch('/api/version')
                .then(response => response.json())
                .then(data => setVersion(data.version));

            setLoading(false);
        }
        firstRun();

        if (authenticated !== undefined && authenticated !== null && authenticated) navigate('/');
    });

    return authenticated === false ? (
        loading ?
            <Loading /> :
            <div className="login-wrapper">
                <div className='login'>
                    <div className='login-stack'>
                        <div className='login-card login-left'></div>
                        <div className='login-card login-center'></div>
                        <div className='login-card login-right'></div>
                    </div>
                    <div title={`Version ${version}`}>
                        <h1 className='fade first-fade' style={{ animationDelay: '0.5s' }}>Cards</h1>
                    </div>
                    <LoginForm />
                </div>
            </div>
    ) : <div></div>;
}