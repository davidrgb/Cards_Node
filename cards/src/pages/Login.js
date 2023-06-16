import './Login.css';

import LoginForm from '../components/LoginForm';

export default function Login() {
    return (
        <div className='login'>
            <div className='stack'>
                <div className='card left'></div>
                <div className='card center'></div>
                <div className='card right'></div>
            </div>          
            <h1 className='fade first-fade'>Cards</h1>
            <LoginForm />
        </div>
    );
}