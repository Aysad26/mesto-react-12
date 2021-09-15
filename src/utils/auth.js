import BadRequestError from '../errors/BadRequestError';
import UnauthorizedError from '../errors/UnauthorizedError';
export const BASE_URL = 'http://www.api.s-mesto.students.nomoreparties.co';

// Отправляем запрос за регистрацию
export const register = (password, email) => fetch(`${BASE_URL}/signup`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ password, email }),
})
  .then((res) => {
    if (!res.ok) {
      return res.json()
        .then((err) => {
          if (err.error) {
            throw new BadRequestError(err.error);
          } else {
            throw new BadRequestError(err.message);
          }
        });
    }
    return res.json();
  });

// Отправляем запрос за авторизацию
export const authorize = (password, email) => fetch(`${BASE_URL}/signin`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ password, email }),
})
  .then((res) => {
    if (res.status === 400) {
      throw new BadRequestError('Не передано одно из полей');
    }
    else if (res.status === 401) {
      throw new UnauthorizedError('Пользователь с таким email не найден');
    }
    return res.json();
  })
  .then((data) => {
    if (data.token) {
      localStorage.setItem('jwt', data.token);
      return data.token;
    }
  });

// Отправляем запрос за получение токена
export const getContent = (token) => fetch(`${BASE_URL}/users/me`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
})
  .then((res) => {
    if (!res.ok) {
      return res.json()
        .then((err) => {
          throw new UnauthorizedError(err.message);
        });
    }
    return res.json()
  })
  .then((data) => data);
