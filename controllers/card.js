const Card = require("../models/card");

const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Некорректные данные" });
      }
      res.status(500).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  return Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error("Карточка не найдена");
      error.name = "CardNotFoundError";
      throw error;
    })
    .then(() => {
      res.status(200).send({ message: "Карточка удалена" });
    })
    .catch((err) => {
      if (err.name === "CardNotFoundError") {
        res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Неккоректный id" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Карточка не найдена");
      error.name = "CardNotFoundError";
      throw error;
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CardNotFoundError") {
        res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Некорректный id" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Карточка не найдена");
      error.name = "CardNotFoundError";
      throw error;
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CardNotFoundError") {
        res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Некорректный id" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
