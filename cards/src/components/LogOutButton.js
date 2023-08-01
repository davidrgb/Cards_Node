import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import LogoutIcon from '@mui/icons-material/Logout';

import './Button.css';

export default function LogOutButton() {
    const [inputDisabled, setInputDisabled] = useState(false);

    const navigate = useNavigate();

    async function handleLogOutClick() {
        setInputDisabled(true);

        const requestOptions = {
            method: 'POST',
        };
        await fetch('/logout', requestOptions)
            .then(navigate('/login', { state: { target: '/' } }));

        setInputDisabled(false);
    }

    return (
        <button className="rounded-square-button" onClick={handleLogOutClick} disabled={inputDisabled}><LogoutIcon /></button>
    );
}