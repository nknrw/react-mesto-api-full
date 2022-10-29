const { NODE_ENV } = process.env;

const baseUrl = NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.mesto.nknrw.nomoredomains.icu';

function checkResponse(res) {
    if (res.ok) {
        return res.json();
    } else {
    return Promise.reject(`Ошибка: ${res.status}`);
    }
}

export function register(email, password) {
    return fetch(`${baseUrl}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
    })
        .then(checkResponse);
}

export function authorize(email, password) {
    return fetch(`${baseUrl}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
    })
        .then(checkResponse);
}

export function getContent(token) {
    return fetch(`${baseUrl}/users/me`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        credentials: 'include',
    })
        .then(checkResponse);
}