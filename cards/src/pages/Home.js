import { useEffect, useState } from 'react';

import { createPortal } from "react-dom";

import { useNavigate } from 'react-router-dom';

import AbcIcon from '@mui/icons-material/Abc';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';

import { Deck } from '../data/Deck.js';

import {
    validateTitle, titleError,
    validateDescription, descriptionError,
} from '../data/Utility.js';

import DeckView from '../components/DeckView';
import Loading from '../components/Loading';

import '../components/Button.css';
import '../components/Form.css';

import './Home.css';

export default function Home() {
    const Sort = {
        Timestamp: {
            icon: <AccessTimeIcon />,
            value: 'Timestamp',
        },
        Title: {
            icon: <AbcIcon />,
            value: 'Title',
        },
    };

    const Order = {
        Descending: {
            icon: <ArrowDownwardIcon />,
            value: 'Descending',
        },
        Ascending: {
            icon: <ArrowUpwardIcon />,
            value: 'Ascending',
        },
    }

    const [username, setUsername] = useState(null);
    const [decks, setDecks] = useState([]);
    const [sortBy, setSortBy] = useState(Sort.Timestamp);
    const [orderBy, setOrderBy] = useState(Order.Descending);
    const [deckInterval, setDeckInterval] = useState();
    const [loading, setLoading] = useState(true);

    const toggleSortBy = () => {
        switch (sortBy.value) {
            case Sort.Timestamp.value:
                setSortBy(Sort.Title);
                break;
            case Sort.Title.value:
                setSortBy(Sort.Timestamp);
                break;
            default:
                setSortBy(Sort.Title);
                break;
        }
    }

    const toggleOrderBy = () => {
        switch (orderBy.value) {
            case Order.Descending.value:
                setOrderBy(Order.Ascending);
                break;
            case Order.Ascending.value:
                setOrderBy(Order.Descending);
                break;
            default:
                setOrderBy(Order.Ascending);
                break;
        }
    }

    useEffect(() => {
        const sortByTimestamp = () => {
            setDecks(decks => [...decks].sort((a, b) => { return orderBy.value === 'Descending' ? Date.parse(b.ts) - Date.parse(a.ts) : Date.parse(a.ts) - Date.parse(b.ts) }));
        }

        const sortByTitle = () => {
            setDecks(decks => [...decks].sort((a, b) => orderBy.value === 'Descending' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)));
        }

        const sortDecks = () => {
            switch (sortBy.value) {
                case Sort.Timestamp.value:
                    sortByTimestamp();
                    break;
                case Sort.Title.value:
                    sortByTitle();
                    break;
                default:
                    sortByTimestamp();
                    break;
            }
        }

        sortDecks();
    }, [sortBy, orderBy, decks, Sort.Timestamp.value, Sort.Title.value]);

    const getDecks = async () => {
        await fetch(`/api/decks`)
            .then(response => response.json())
            .then(data => {
                setDecks([]);
                data.forEach(deck => {
                    let d = new Deck(deck);
                    setDecks(decks => [...decks, d].sort((a, b) => { return Date.parse(b.ts) - Date.parse(a.ts) }));
                });
            });
    }

    useEffect(() => {
        const getUsername = async () => await fetch('/api/user')
            .then(response => response.json())
            .then(data => setUsername(data.username));
        getUsername();

        const firstRun = async () => {
            await getDecks()
            setLoading(false);
        }
        firstRun();

        setDeckInterval(setInterval(() => getDecks(), 5000));
    }, [setDeckInterval]);

    useEffect(() => {
        return () => clearInterval(deckInterval);
    }, [deckInterval]);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(0);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(0);

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

    const openDeleteModal = (index) => {
        setDeleteIndex(index);
        setDeleteModalOpen(true);
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    }

    const [searchKey, setSearchKey] = useState('');

    return (
        loading ?
            <Loading /> :
            <div className="home-wrapper">
                {
                    decks.length > 0 ?
                        <div className="control-row fade first-fade">
                            <input className="search" name="search" placeholder="Search" maxlength="250" onChange={(e) => setSearchKey(e.target.value)}></input>
                            <button className="rounded-square-button" onClick={toggleSortBy} title={`Sort by ${sortBy.value}`}>{sortBy.icon}</button>
                            <button className="rounded-square-button" onClick={toggleOrderBy} title={`Order by ${orderBy.value}`}>{orderBy.icon}</button>
                        </div> :
                        <></>
                }
                {decks.length > 0 ?
                    <ul className="deck-list">
                        {
                            decks.map((deck, index) => {
                                return <div className="deck-row fade" style={{ animationDelay: `${0.2 + (0.025 * (index + 1))}s`, display: searchKey !== null && searchKey.length > 0 ? deck.title.toUpperCase().includes(searchKey.toUpperCase()) ? 'flex' : 'none' : 'flex' }} title="Open Deck">
                                    <DeckView deck={deck} openEditModal={() => openEditModal(index)} openDeleteModal={() => openDeleteModal(index)} username={username} deckInterval={deckInterval} />
                                </div>
                            })
                        }
                    </ul> :
                    <div className="deck-list">
                        <h2 className="fade first-fade" style={{ margin: '0' }}>Nothing to show yet</h2>
                        <h3 className="fade second-fade" style={{ color: 'white', margin: '0' }}>Start by creating your first deck</h3>
                    </div>
                }
                <button className="circular-button fade" style={{ animationDelay: `${0.3 + (0.025 * (decks.length))}s` }} onClick={openCreateModal} title="Create Deck"><AddIcon /></button>
                {createModalOpen && <CreateDeckModal closeModal={closeCreateModal} deckInterval={deckInterval} setLoading={setLoading} />}
                {editModalOpen && <EditDeckModal closeModal={closeEditModal} decks={decks} index={editIndex} setDecks={setDecks} setLoading={setLoading} />}
                {deleteModalOpen && <DeleteDeckModal closeModal={closeDeleteModal} decks={decks} index={deleteIndex} setDecks={setDecks} setLoading={setLoading} />}
            </div>
    );
}

function CreateDeckModal({ closeModal, deckInterval, setLoading }) {
    const [error, setError] = useState();
    const [errorStyle, setErrorStyle] = useState();
    const [inputDisabled, setInputDisabled] = useState(false);

    const handleClick = () => {
        closeModal();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setInputDisabled(true);
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

    const navigate = useNavigate();

    function errorHandling(title, description) {
        const validTitle = validateTitle(title);
        if (!validTitle) {
            setError(titleError(title));
            displayErrorMessage();
            return false;
        }

        const validDescription = validateDescription(description);
        if (!validDescription) {
            setError(descriptionError(description));
            displayErrorMessage();
            return false;
        }

        if (error !== '') {
            setError('');
            hideErrorMessage();
        }

        return true;
    }

    async function createDeck(title, description) {
        if (!errorHandling(title, description)) {
            setInputDisabled(false);
            return;
        }

        setLoading(true);

        if (description === undefined) description = null;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: description })
        };
        await fetch('/api/create/deck', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error === undefined) {
                    clearInterval(deckInterval);
                    return navigate(`/deck/${data.id}`);
                }
                else {
                    setLoading(false);
                    setError(data.error);
                    displayErrorMessage();
                    setInputDisabled(false);
                }
            });
    }

    return createPortal(
        <div className="deck-modal-wrapper fade first-fade-fast">
            <div className="deck-modal fade second-fade-fast">
                <form id="create-deck-modal-form" onSubmit={handleSubmit}>
                    <button className="circular-button fade third-fade-fast" type="button" onClick={handleClick} title="Cancel" disabled={inputDisabled}><CloseIcon /></button>
                    <div className="form-group">
                        <textarea className="fade fourth-fade-fast" name="title" placeholder="Title" maxlength="250" readOnly={inputDisabled}></textarea>
                        <textarea className="fade fifth-fade-fast" name="description" placeholder="Description (Optional)" maxLength="1000" rows="5" readOnly={inputDisabled}></textarea>
                    </div>
                    <div className="form-error fade sixth-fade-fast" style={errorStyle}>
                        {error}
                    </div>
                    <div className="form-group fade seventh-fade-fast">
                        <button type="submit" disabled={inputDisabled}>Create</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

function EditDeckModal({ closeModal, decks, index, setDecks, setLoading }) {
    const [error, setError] = useState();
    const [errorStyle, setErrorStyle] = useState();
    const [inputDisabled, setInputDisabled] = useState(false);

    const handleClick = () => {
        closeModal();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setInputDisabled(true);
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

    function errorHandling(title, description) {
        const validTitle = validateTitle(title);
        if (!validTitle) {
            setError(titleError(title));
            displayErrorMessage();
            return false;
        }

        const validDescription = validateDescription(description);
        if (!validDescription) {
            setError(descriptionError(description));
            displayErrorMessage();
            return false;
        }

        if (error !== '') {
            setError('');
            hideErrorMessage();
        }

        return true;
    }

    async function editDeck(title, description) {
        if (!errorHandling(title, description)) {
            setInputDisabled(false);
            return;
        }

        setLoading(true);

        if (description === undefined) description = null;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: description })
        };
        await fetch(`/api/update/deck/${decks[index].id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error === undefined) {
                    setLoading(false);
                    let copy = [...decks];
                    copy[index].title = title;
                    copy[index].description = description;
                    copy[index].ts = new Date().toLocaleString();
                    setDecks([...copy].sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts)));
                    closeModal();
                }
                else {
                    setLoading(false);
                    setError(`${data.error}`);
                    displayErrorMessage();
                    setInputDisabled(false);
                }
            });
    }

    const [temp, setTemp] = useState({ title: decks[index].title, description: decks[index].description });

    return createPortal(
        <div className="deck-modal-wrapper fade first-fade-fast">
            <div className="deck-modal fade second-fade-fast">
                <form id="edit-deck-modal-form" onSubmit={handleSubmit}>
                    <button className="circular-button fade third-fade-fast" type="button" onClick={handleClick} title="Cancel" disabled={inputDisabled}><CloseIcon /></button>
                    <div className="form-group">
                        <textarea className="fade fourth-fade-fast" name="title" placeholder="Title" maxlength="250" value={temp.title} onChange={(e) => setTemp({ title: e.target.value, description: temp.description })} readOnly={inputDisabled}></textarea>
                        <textarea className="fade fifth-fade-fast" name="description" placeholder="Description (Optional)" maxLength="1000" rows="5" value={temp.description ??= ''} onChange={(e) => setTemp({ title: temp.title, description: e.target.value })} readOnly={inputDisabled}></textarea>
                    </div>
                    <div className="form-error fade sixth-fade-fast" style={errorStyle}>
                        {error}
                    </div>
                    <div className="form-group fade seventh-fade-fast">
                        <button type="submit" disabled={inputDisabled}>Update</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

function DeleteDeckModal({ closeModal, decks, index, setDecks, setLoading }) {
    const [error, setError] = useState();
    const [errorStyle, setErrorStyle] = useState();
    const [inputDisabled, setInputDisabled] = useState(false);

    const handleClick = () => {
        closeModal();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setInputDisabled(true);
        const title = e.target.title.value;
        deleteDeck(title);
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

    function errorHandling(title) {
        if (title !== originalTitle) {
            setError('Title does not match');
            displayErrorMessage();
            return false;
        }

        if (error !== '') {
            setError('');
            hideErrorMessage();
        }
        
        return true;
    }

    async function deleteDeck(title) {
        if (!errorHandling(title)) {
            setInputDisabled(false);
            return;
        }

        setLoading(true);

        const requestOptions = {
            method: 'POST',
        };
        await fetch(`/api/delete/deck/${decks[index].id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error === undefined) {
                    setLoading(false);
                    let copy = [...decks];
                    copy.splice(index, 1);
                    setDecks([...copy]);
                    closeModal();
                }
                else {
                    setLoading(false);
                    setError(`${data.error}`);
                    displayErrorMessage();
                    setInputDisabled(false);
                }
            });
    }

    const originalTitle = decks[index].title;

    return createPortal(
        <div className="deck-modal-wrapper fade first-fade-fast">
            <div className="deck-modal fade second-fade-fast">
                <form id="delete-deck-modal-form" onSubmit={handleSubmit}>
                    <button className="circular-button fade third-fade-fast" type="button" onClick={handleClick} title="Cancel" disabled={inputDisabled}><CloseIcon /></button>
                    <div className="form-group fade fourth-fade-fast">
                        <span>Delete <span style={{color: '#5AB0FF'}}>{decks[index].title}</span>?</span>
                    </div>
                    <div className="form-group">
                        <textarea className="fade fifth-fade-fast" name="title" placeholder="Type title here to verify" maxlength="250" readOnly={inputDisabled}></textarea>
                    </div>
                    <div className="form-error fade sixth-fade-fast" style={errorStyle}>
                        {error}
                    </div>
                    <div className="form-group fade seventh-fade-fast">
                        <button className="warning-button" type="submit" disabled={inputDisabled}>Delete</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}