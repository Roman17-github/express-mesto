const User = require("../models/user");

const getUsers = (req, res) => {
  return User.find({})
    .then(users => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

const getUser = (req, res) => {
  return User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('Пользователь не найден');
      err.name = 'UserNotFoundError'; // или любой другой признак, по которому в catch можно будет определить эту ошибку
      throw error;
    })
    .then(user => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      if(err.name === 'UserNotFoundError') {
        res.status(404).send(err.message);
      }else{
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

const createUser = (req, res) => {

  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send("Некорректные данные")
      }
      res.status(500).send({ message: err.message })
    });
}

const upDateUser = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.params.id, { name, about }, { new: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
}

const upDateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.params.id, { avatar }, { new: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: err.message }));

}

module.exports = { getUsers, getUser, createUser, upDateUser, upDateAvatar };