import './LogOutButton.css';

import { useNavigate } from 'react-router-dom';

export default function LogOutButton() {
    const navigate = useNavigate();

    function handleLogOutClick() {
        const requestOptions = {
            method: 'POST',
        };
        fetch('/logout', requestOptions)
            .then(response => {
                navigate('/login', { state: { target: '/' } });
            });
    }

    return (
        <button className="log-out-button" onClick={handleLogOutClick}>Log Out</button>
    );
}