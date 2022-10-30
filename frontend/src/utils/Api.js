const { NODE_ENV } = process.env;

class Api {
	constructor({ baseUrl, headers }) {
		this._baseUrl = baseUrl;
		this._headers = headers;
	}

	// Проверка ответа сервера
	_getResponseData(res) {
		if (!res.ok) {
			return Promise.reject(`Ошибка: ${res.status}`);
		}
		return res.json();
	}

	// Получаение данных пользователя
	getUserInfo() {
		return fetch(`${this._baseUrl}/users/me`, {
			headers: this._headers,
			credentials: 'include',
		}).then((res) => this._getResponseData(res));
	}

	// Отправка данных пользователя
	setUserInfo({ name, about }) {
		return fetch(`${this._baseUrl}/users/me`, {
			method: 'PATCH',
			headers: this._headers,
			credentials: 'include',
			body: JSON.stringify({
				name: name,
				about: about,
			}),
		}).then((res) => this._getResponseData(res));
	}

	// Получение карточки
	getInitialCards() {
		return fetch(`${this._baseUrl}/cards`, {
			headers: this._headers,
			credentials: 'include',
		}).then((res) => this._getResponseData(res));
	}

	// Добавление карточки
	addCard({ name, link }) {
		return fetch(`${this._baseUrl}/cards`, {
			method: 'POST',
			headers: this._headers,
			credentials: 'include',
			body: JSON.stringify({ name: name, link: link }),
		}).then((res) => this._getResponseData(res));
	}

	// Удаление карточки
	deleteCard(cardId) {
		return fetch(`${this._baseUrl}/cards/${cardId}`, {
			method: 'DELETE',
			headers: this._headers,
			credentials: 'include',
		}).then((res) => this._getResponseData(res));
	}
	
	// Постановка/снятие лайка
	// changeLikeCardStatus(cardId, isLiked) {
	// 	if (isLiked) {
	// 		return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
	// 			method: "DELETE",
	// 			headers: this._headers,
	// 			credentials: 'include',
	// 		}).then(this._getResponseData);
	// 	} else {
	// 		return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
	// 			method: "PUT",
	// 			headers: this._headers,
	// 			credentials: 'include',
	// 		}).then(this._getResponseData);
	// 	}
	// }

	changeLikeCardStatus(cardId, isLiked) {
		return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
			method: isLiked ? 'DELETE' : 'PUT',
			headers: this._headers,
			credentials: 'include',
		}).then((res) => this._getResponseData(res));
	}

	// Изменение аватара
	setUserAvatar(avatar) {
		return fetch(`${this._baseUrl}/users/me/avatar`, {
			method: 'PATCH',
			headers: this._headers,
			credentials: 'include',
			body: JSON.stringify(avatar),
		}).then((res) => this._getResponseData(res));
	}
}

// Авторизация
const api = new Api({
	baseUrl: NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.mesto.nknrw.nomoredomains.icu',
	headers: {
		'Content-Type': 'application/json',
	},
});

export default api;
