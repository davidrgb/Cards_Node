import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function DeckPage() {
    let { deckId } = useParams();

    const [deck, setDeck] = useState();

    useEffect(() => {
        fetch(`/api/deck/${deckId}`)
            .then(response => response.json())
            .then(data => setDeck(data));
    }, []);

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