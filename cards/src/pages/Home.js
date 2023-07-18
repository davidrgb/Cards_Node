import { useState } from 'react';
import { createPortal } from "react-dom";
import { useNavigate } from 'react-router-dom';

import CircularButton from "../components/CircularButton";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import './Home.css';
import '../components/Form.css';

export default function Home() {
    const target = '/';

    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    return (
        <div className='home'>
            <h1>Home</h1>
            <CircularButton innerHTML={<AddIcon />} handleClick={openModal} />
            {modalOpen && <CreateDeckModal closeModal={closeModal} />}
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
        <div className="create-deck-modal">
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