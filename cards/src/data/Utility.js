export const Status = {
    OK: 200,
    Created: 201,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    InternalServerError: 500,
}

function findInvalidCharacter(re, string) {
    for (let i = 0; i < string.length; i++) {
        if (!re.test(string[i])) return { index: i + 1, character: string[i] };
    }
}

const usernameExpression = /^[a-zA-Z._0-9-]{1,16}$/;
const passwordExpression = /^[a-zA-Z0-9~`!@#$%^&*()_+={[}\]|\\|:;"'<,>.?/-]{8,32}$/;
const passwordCharacterExpression = /^[a-zA-Z0-9~`!@#$%^&*()_+={[}\]|\\|:;"'<,>.?/-]$/;

export function validateUsername(username) {
    if (username === undefined || username === null || username.length === 0) return false;
    return usernameExpression.test(username);
}

export function usernameError(username) {
    if (username.length < 1) return 'Username required'
    else if (username.length > 16) return 'Username must be no more than 16 characters';
    else {
        const invalidCharacter = findInvalidCharacter(usernameExpression, username);
        return `Invalid character '${invalidCharacter.character}' at position ${invalidCharacter.index} in username`;
    }
}

export function validatePassword(password) {
    if (password === undefined || password === null || password.length === 0) return false;
    return passwordExpression.test(password);
}

export function passwordError(password) {
    if (password.length < 8) return 'Password must be at least 8 characters';
    else if (password.length > 32) return 'Password must be no more than 32 characters';
    else {
        const invalidCharacter = findInvalidCharacter(passwordCharacterExpression, password);
        return `Invalid character '${invalidCharacter.character}' at position ${invalidCharacter.index} in password`;
    }
}

const titleExpression = /^[a-zA-Z0-9~`!@#$%^&*()_+={[}\]|\\|:;"'<,>. ?/-]{1,250}$/;
const descriptionExpression = /^[a-zA-Z0-9~`!@#$%^&*()_+={[}\]|\\|:;"'<,>. ?/-]{0,1000}$/;

export function validateTitle(title) {
    if (title === undefined || title === null || title.length === 0) return false;
    return titleExpression.test(title);
}

export function titleError(title) {
    if (title.length < 1) return 'Title required';
    else if (title.length > 250) return 'Title must be no more than 250 characters';
    else {
        const invalidCharacter = findInvalidCharacter(titleExpression, title);
        return `Invalid character '${invalidCharacter.character} at position ${invalidCharacter.index} in title`;
    }
}

export function validateDescription(description) {
    if (description === undefined || description === null || description.length === 0) return true;
    return descriptionExpression.test(description);
}

export function descriptionError(description) {
    if (description.length > 1000) return 'Description must be no more than 1000 characters';
    else {
        const invalidCharacter = findInvalidCharacter(descriptionExpression, description);
        return `Invalid character '${invalidCharacter.character}' at position ${invalidCharacter.index} in description`;
    }

}