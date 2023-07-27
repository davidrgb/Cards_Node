import { useNavigate } from 'react-router-dom';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import './Button.css';

import './DeckView.css';

export default function DeckView({ deck, openEditModal, openDeleteModal }) {
    const navigate = useNavigate();

    function openDeck() {
        return navigate(`/deck/${deck.id}`);
    }

    return (
        <div className="deck-div" onClick={openDeck}>
            <div className="deck-info">
                <div className="deck-title">{deck.title}</div>
                {deck.description && <div className="deck-description">{deck.description}</div>}
                <div className="deck-footer">
                    <div className="deck-timestamp">{new Date(deck.ts).toLocaleString()}</div>
                    <div className="deck-creator">{`Created by ${deck.owner}`}</div>
                </div>
            </div>
            <div className="button-column">
                <button className="square-button" style={{borderRadius: "10px 10px 0 0"}} onClick={(event) => { event.stopPropagation(); openEditModal() }}><EditIcon /></button>
                <button className="square-button" style={{borderRadius: "0 0 10px 10px"}} onClick={(event) => { event.stopPropagation(); openDeleteModal() }}><DeleteIcon /></button>
            </div>
        </div>
    );
}