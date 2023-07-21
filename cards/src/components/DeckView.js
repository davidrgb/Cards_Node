import './DeckView.css';

import { useNavigate } from 'react-router-dom';

export default function DeckView({ deck }) {
    const navigate = useNavigate();

    function openDeck() {
        return navigate(`/deck/${deck.id}`);
    }

    return (
        <div className="deck-div" onClick={openDeck}>
            <div>{deck.title}</div>
            {deck.description && <div className="deck-description">{deck.description}</div>}
            <div className="deck-timestamp">{new Date(deck.ts).toLocaleString()}</div>
        </div>
    );
}