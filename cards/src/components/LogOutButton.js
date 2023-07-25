import { useNavigate } from 'react-router-dom';

import LogoutIcon from '@mui/icons-material/Logout';

import './Button.css';

export default function LogOutButton() {
    const navigate = useNavigate();

    function handleLogOutClick() {
        const requestOptions = {
            method: 'POST',
        };
        fetch('/logout', requestOptions)
            .then(navigate('/login', { state: { target: '/' } }));
    }

    return (
        <button className="rounded-square-button" onClick={handleLogOutClick}><LogoutIcon /></button>
    );
}