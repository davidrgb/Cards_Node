import { useNavigate } from 'react-router-dom';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import './Button.css';

import './DeckView.css';

export default function DeckView({ deck, openEditModal, openDeleteModal, username, deckInterval }) {
    const navigate = useNavigate();

    function openDeck() {
        clearInterval(deckInterval);
        return navigate(`/deck/${deck.id}`);
    }

    return (
        <div className="deck-div" onClick={openDeck}>
            <div className="deck-info">
                <div className="deck-title">{deck.title}</div>
                {deck.description && <div className="deck-description">{deck.description}</div>}
                <div className="deck-footer">
                    <div className="deck-timestamp">{new Date(deck.ts).toLocaleString()}</div>
                    <div className="deck-creator">{username !== null && deck.owner === username ? 'Created by you' : <span>Shared by <span style={{ color: '#5AB0FF' }}>{deck.owner}</span></span>}</div>
                </div>
            </div>
            <div className="button-column">
                <button className="square-button" style={{ borderRadius: "10px 10px 0 0" }} title="Edit Deck" disabled={username === null || deck.owner !== username} onClick={(event) => { event.stopPropagation(); openEditModal() }}><EditIcon /></button>
                <button className="square-button" style={{ borderRadius: "0 0 10px 10px" }} title="Delete Deck" disabled={username === null || deck.owner !== username} onClick={(event) => { event.stopPropagation(); openDeleteModal() }}><DeleteIcon /></button>
            </div>
        </div>
    );
}