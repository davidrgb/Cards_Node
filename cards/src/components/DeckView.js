import './DeckView.css';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DeckView() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { deck } = state ? state : null;

    function openDeck() {
        return navigate(`/deck/${deck.creator}/${id}`);
    }

    return (
        deck ? 
        <div className="deck-div" onClick={openDeck}>
            
        </div> : 
        <div></div>
    )
}