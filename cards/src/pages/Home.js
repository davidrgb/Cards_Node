import { useEffect, useState } from 'react';
import { createPortal } from "react-dom";
import { useNavigate } from 'react-router-dom';

import CircularButton from "../components/CircularButton";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import './Home.css';
import '../components/Form.css';

import { Deck } from '../data/Deck.js';
import DeckView from '../components/DeckView';

export default function Home() {
    const target = '/';

    const [decks, setDecks] = useState([]);

    useEffect(() => {
        const getDecks = async () => await fetch(`/api/decks`)
            .then(response => response.json())
            .then(data => {
                data.forEach(deck => {
                    let d = new Deck(deck);
                    setDecks(decks => [...decks, d].sort((a, b) => { return Date.parse(b.ts) - Date.parse(a.ts)}));
                });
            })
        getDecks();
    }, []);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(0);

    const openCreateModal = () => {
        setCreateModalOpen(true);
    }

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    }

    const openEditModal = (index) => {
        setEditIndex(index);
        setEditModalOpen(true);
    }

    const closeEditModal = () => {
        setEditModalOpen(false);
    }

    return (
        <div>
            <h1>Decks</h1>
            {decks.length > 0 ?
                <ul className="deck-list">
                    {
                        decks.map((deck, index) => {
                            return <div><DeckView deck={deck} /><button onClick={() => openEditModal(index)}>Edit</button></div>
                        })
                    }
                </ul> :
                <div>
                    <h2>Nothing to show yet</h2>
                </div>
            }
            <CircularButton innerHTML={<AddIcon />} handleClick={openCreateModal} />
            {createModalOpen && <CreateDeckModal closeModal={closeCreateModal} />}
            {editModalOpen && <EditDeckModal closeModal={closeEditModal} decks={decks} index={editIndex} setDecks={setDecks} />}
        </div>
    );
}

function CreateDeckModal({ closeModal }) {
    const [error, setError] = useState();
    const [errorStyle, setErrorStyle] = useState();

    const handleClick = () => {
        closeModal();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value.length > 0 ? e.target.description.value : null;
        createDeck(title, description);
    }

    function displayErrorMessage() {
        if (error !== '') {
            setErrorStyle({
                display: 'block',
            });
        }
    }

    function hideErrorMessage() {
        if (error === '') {
            setErrorStyle({
                display: 'none',
            });
        }
    }

    const titleExpression = /^[a-zA-Z0-9~`!@#$%^&*()_+={[}\]|\\|:;"'<,>. ?/-]{1,250}$/;
    const descriptionExpression = /^[a-zA-Z0-9~`!@#$%^&*()_+={[}\]|\\|:;"'<,>. ?/-]{0,1000}$/;

    function validateTitle(title) {
        if (title === undefined || title === null || title.length === 0) return false;
        return titleExpression.test(title);
    }

    function validateDescription(description) {
        if (description === undefined || description === null || description.length === 0) return true;
        return descriptionExpression.test(description);
    }

    function findInvalidCharacter(re, string) {
        for (let i = 0; i < string.length; i++) {
            if (!re.test(string[i])) return { index: i + 1, character: string[i] };
        }
    }

    const navigate = useNavigate();

    function errorHandling(title, description) {
        const validTitle = validateTitle(title);
        if (!validTitle) {
            if (title.length < 1) setError('Title required');
            else if (title.length > 250) setError('Title must be no more than 250 characters');
            else {
                const invalidCharacter = findInvalidCharacter(titleExpression, title);
                setError(`Invalid character '${invalidCharacter.character} at position ${invalidCharacter.index} in title`);
            }
            displayErrorMessage();
            return false;
        }

        const validDescription = validateDescription(description);
        if (!validDescription) {
            if (description.length > 1000) setError('Description must be no more than 1000 characters');
            else {
                const invalidCharacter = findInvalidCharacter(descriptionExpression, description);
                setError(`Invalid character '${invalidCharacter.character}' at position ${invalidCharacter.index} in password`);
            }
            displayErrorMessage();
            return false;
        }

        if (error !== '') {
            setError('');
            hideErrorMessage();
        }

        return true;
    }

    function createDeck(title, description) {
        if (!errorHandling(title, description)) return;

        if (description === undefined) description = null;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: description })
        };
        fetch('/api/create/deck', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error !== undefined && data.error !== null) {
                    setError(`Failed to create deck: ${data.error}`);
                    displayErrorMessage();
                }
                else return navigate(`/deck/${data.id}`);
            });
    }

    return createPortal(
        <div className="deck-modal">
            <form id="create-deck-modal-form" onSubmit={handleSubmit}>
                <CircularButton innerHTML={<CloseIcon />} handleClick={handleClick} />
                <div className="form-group">
                    <input type="text" name="title" placeholder="Title" maxlength="250"></input>
                    <textarea name="description" placeholder="Description (Optional)" maxLength="1000" rows="5"></textarea>
                </div>
                <div className="form-error" style={errorStyle}>
                    {error}
                </div>
                <div className="form-group">
                    <button type="submit">Create</button>
                </div>
            </form>
        </div>,
        document.body
    );
}

function EditDeckModal({ closeModal, decks, index, setDecks }) {
    const [error, setError] = useState();
    const [errorStyle, setErrorStyle] = useState();

    const handleClick = () => {
        closeModal();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value.length > 0 ? e.target.description.value : null;
        editDeck(title, description);
    }

    function displayErrorMessage() {
        if (error !== '') {
            setErrorStyle({
                display: 'block',
            });
        }
    }

    function hideErrorMessage() {
        if (error === '') {
            setErrorStyle({
                display: 'none',
            });
        }
    }

    const titleExpression = /^[a-zA-Z0-9~`!@#$%^&*()_+={[}\]|\\|:;"'<,>. ?/-]{1,250}$/;
    const descriptionExpression = /^[a-zA-Z0-9~`!@#$%^&*()_+={[}\]|\\|:;"'<,>. ?/-]{0,1000}$/;

    function validateTitle(title) {
        if (title === undefined || title === null || title.length === 0) return false;
        return titleExpression.test(title);
    }

    function validateDescription(description) {
        if (description === undefined || description === null || description.length === 0) return true;
        return descriptionExpression.test(description);
    }

    function findInvalidCharacter(re, string) {
        for (let i = 0; i < string.length; i++) {
            if (!re.test(string[i])) return { index: i + 1, character: string[i] };
        }
    }

    function errorHandling(title, description) {
        const validTitle = validateTitle(title);
        if (!validTitle) {
            if (title.length < 1) setError('Title required');
            else if (title.length > 250) setError('Title must be no more than 250 characters');
            else {
                const invalidCharacter = findInvalidCharacter(titleExpression, title);
                setError(`Invalid character '${invalidCharacter.character} at position ${invalidCharacter.index} in title`);
            }
            displayErrorMessage();
            return false;
        }

        const validDescription = validateDescription(description);
        if (!validDescription) {
            if (description.length > 1000) setError('Description must be no more than 1000 characters');
            else {
                const invalidCharacter = findInvalidCharacter(descriptionExpression, description);
                setError(`Invalid character '${invalidCharacter.character}' at position ${invalidCharacter.index} in password`);
            }
            displayErrorMessage();
            return false;
        }

        if (error !== '') {
            setError('');
            hideErrorMessage();
        }

        return true;
    }

    function editDeck(title, description) {
        if (!errorHandling(title, description)) return;

        if (description === undefined) description = null;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: description })
        };
        fetch(`/api/update/deck/${decks[index].id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error !== undefined && data.error !== null) {
                    setError(`Failed to update deck: ${data.error}`);
                    displayErrorMessage();
                }
                else {
                    let copy = [...decks];
                    copy[index].title = title;
                    copy[index].description = description;
                    copy[index].ts = new Date().toLocaleString();
                    setDecks([...copy].sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts)));
                    closeModal();
                }
            });
    }

    const [temp, setTemp] = useState({title: decks[index].title, description: decks[index].description});

    return createPortal(
        <div className="deck-modal">
            <form id="edit-deck-modal-form" onSubmit={handleSubmit}>
                <CircularButton innerHTML={<CloseIcon />} handleClick={handleClick} />
                <div className="form-group">
                    <input type="text" name="title" placeholder="Title" maxlength="250" value={temp.title} onChange={(e) => setTemp({title: e.target.value, description: temp.description})}></input>
                    <textarea name="description" placeholder="Description (Optional)" maxLength="1000" rows="5" value={temp.description ??= ''} onChange={(e) => setTemp({title: temp.title, description: e.target.value})}></textarea>
                </div>
                <div className="form-error" style={errorStyle}>
                    {error}
                </div>
                <div className="form-group">
                    <button type="submit">Update</button>
                </div>
            </form>
        </div>,
        document.body
    );
}