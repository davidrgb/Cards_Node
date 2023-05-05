import * as Router from '../controller/router.js';

import * as Element from './element.js';

export async function homePage() {
    let html;

    html = `
        <div style="align-items: center; display: flex; flex-direction: column; height: 100vh; justify-content: center; max-width:90vw;">
            <div style="padding: 5vh 5vw; width: 30rem;">
                <h1>Cards</h1>
                <div style="font-size: 1.5rem; font-weight:bold; padding: 0 0 5vh 0;">
                    Organize and Reorganize.
                </div>
            </div>
        </div>
    `;

    Element.root.innerHTML = html;
}