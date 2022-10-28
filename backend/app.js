require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');
// const ServerError = require('./errors/server-err');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .catch(console.dir);

const app = express();

const allowedCors = [
  'http://mesto.nknrw.nomoredomains.icu',
  'https://mesto.nknrw.nomoredomains.icu',
  'http://localhost:3000',
  'https://localhost:3000',
];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (allowedCors.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false, credentials: true };
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Ошибка сервера' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);

// async function start(req, res, next) {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/mestodb', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     await app.listen(PORT);
//   } catch (err) {
//     next(new ServerError('Ошибка сервера'));
//   }
// }

// start();
