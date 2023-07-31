import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import Loading from '../components/Loading';

export default function DeckPage() {
    let { deckId } = useParams();

    const [deck, setDeck] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const firstRun = async () => {
            await fetch(`/api/deck/${deckId}`)
                .then(response => response.json())
                .then(data => setDeck(data));
            setLoading(false);
        }
        firstRun();
    }, []);

    return (
        loading ?
            <Loading /> :
            <div>
                <h1>Deck {deck.title}</h1>
            </div>
    );
}