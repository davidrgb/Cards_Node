import * as Router from '../controller/router.js';

import * as Element from './element.js';

export async function loginPage() {
    let html;

    html = `
        <div class="login">
            <h1>Cards</h1>
            <h2>Login/Sign Up</h2>
            <form id="form-login" class="login">
                <input id="input-email" class="login" type="email" name="email" placeholder="E-Mail">
                <input id="input-password" class="login" type="password" name="password" placeholder="Password">
            </form>
            <div id="error-login" class="error"></div>
        </div>
    `;

    Element.root.innerHTML = html;

    const loginForm = document.getElementById('form-login');
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        
    });
}