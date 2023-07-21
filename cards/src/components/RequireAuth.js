import { useNavigate, useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';

export default function RequireAuth({ children, target='/' }) {
    let { deckId } = useParams();
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState();

    if (target === '/deck') target += `/${deckId}`;

    const requestOptions = {
        method: 'GET',
    };

    useEffect(() => {
        const getAuthenticated = async () => await fetch('/session', requestOptions)
            .then(response => {
                setAuthenticated(response.redirected === false);
            });
        getAuthenticated();
        if (authenticated !== undefined && authenticated !== null && !authenticated) navigate('/login', { state: { target: target } });
    });


    return authenticated ? children : <div></div>;
}