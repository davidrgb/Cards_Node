import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import Loading from './Loading';

export default function RequireAuth({ children, target = '/' }) {
    let { deckId } = useParams();
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState();
    const [loading, setLoading] = useState(true);

    if (target === '/deck') target += `/${deckId}`;

    useEffect(() => {
        const firstRun = async () => {
            await fetch('/session')
                .then(response => {
                    setAuthenticated(response.redirected === false);
                });
            setLoading(false);
        }
        firstRun();

        if (authenticated !== undefined && authenticated !== null && !authenticated) navigate('/login', { state: { target: target } });
    });


    return loading ? <Loading /> : authenticated ? children : <div></div>;
}