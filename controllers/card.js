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
    .then((card) => {
      res.status(200).send(card)
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)


module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard }

