import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Deck() {
    let { deckId } = useParams();

    const [deck, setDeck] = useState();

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'applications/json' }
    }
    fetch(`/api/deck/${deckId}`, requestOptions)
        .then(response => response.json())
        .then(data => setDeck(data));

    return (
        deck ? 
        <div>
            <h1>Deck {deck.title}</h1>
        </div> :
        <div>
            <h1>Loading</h1>
        </div>
    );
}