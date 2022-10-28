const Card = require('../models/cards');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const ServerError = require('../errors/server-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => {
      next(new ServerError('Произошла ошибка'));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card) {
        if (card.owner.toString() === req.user._id) {
          Card.findByIdAndRemove(req.params.cardId)
            .then((deletedCard) => res.send({ deletedCard }));
        } else {
          return next(new ForbiddenError('Нет прав на удаление карточки'));
        }
      } else {
        return next(new NotFoundError('Карточка не найдена'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card });
      }
      return next(new NotFoundError('Карточка не найдена'));
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card });
      }
      return next(new NotFoundError('Карточка не найдена'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};
