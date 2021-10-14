const Card = require("../models/card");

const getCards = (req, res) => {
  return Card.find({})
    .then(cards => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
       return res.status(400).send("Некорректные данные")
      }
      res.status(500).send({ message: err.message })
    })
}

const deleteCard = (req, res) => {
  return Card.findByIdAndRemove(req.params.id)
  .orFail(() => {
    const error = new Error('Пользователь не найден');
    err.name = 'UserNotFoundError';
    throw error;
  })
    .then((card) => {
      res.status(200).send(card)
    })
    .catch((err) => {
      if (err.name === 'UserNotFoundError') {
        res.status(404).send(err.message);
      } else if (err.name === "ValidationError") {
        res.status(400).send("Некорректные данные");
      }
      else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true }
  .orFail(() => {
    const error = new Error('Передана несуществующий id карточки');
    err.name = 'UserNotFoundError';
    throw error;
  })
  .then((card) => {res.send(card)})
  .catch((err) => {
    if (err.name === 'UserNotFoundError') {
      res.status(404).send(err.message);
    } else if (err.name === "ValidationError") {
      res.status(400).send("Некорректные данные");
    }
    else {
      res.status(500).send({ message: 'Произошла ошибка' });
    }
  })
)

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true }
  .orFail(() => {
    const error = new Error('Передана несуществующий id карточки');
    err.name = 'UserNotFoundError';
    throw error;
  })
  .then((card) => {res.send(card)})
  .catch((err) => {
    if (err.name === 'UserNotFoundError') {
      res.status(404).send(err.message);
    } else if (err.name === "ValidationError") {
      res.status(400).send("Некорректные данные");
    }
    else {
      res.status(500).send({ message: 'Произошла ошибка' });
    }
  })
)


module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard }

