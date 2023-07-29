import './Fade.css';

import './Loading.css';

export default function Loading() {
    return (
        <div className="loading-stack-wrapper">
            <div className="loading-stack fade first-fade">
                <div className="loading-card loading-back"></div>
                <div className="loading-card loading-middle"></div>
                <div className="loading-card loading-front"></div>
            </div>
        </div>

    );
}