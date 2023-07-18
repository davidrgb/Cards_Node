import './CircularButton.css';

export default function CircularButton({ innerHTML, handleClick }) {
    return (
        <button className="cancel-button" onClick={handleClick}>{innerHTML}</button>
    )
}