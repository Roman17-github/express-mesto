const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUsers = (req, res, next) => {
  return User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  return User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('Пользователь не найден');
      error.name = 'UserNotFoundError';
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = 400;
        err.message = 'неккоректный id';
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error('Такой email уже существует ');
        error.statusCode = 409;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      res.status(200).send({ message: `Пользователь ${user.name} успешно зарегистрирован` });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = 400;
      }
      next(err);
    });
};

const upDateUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("Пользователь не найден");
      error.name = "UserNotFoundError";
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = 400;
        err.message = "некорректные данные"
      } else if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = "некорректный id";
      }
      next(err)
    });
};

const upDateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("Пользователь не найден");
      error.name = "UserNotFoundError";
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = 400;
        err.message = "некорректные данные"
      } else if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = "некорректный id";
      }
      next(err)
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true
      });
      res.status(200).send({ token: token });

    })
    .catch((err) => {
      if (err.message === 'InvalidLogin') {
        err.statusCode = 401;
      }
      next(err)
    })

}

module.exports = { getUsers, getUser, createUser, upDateUser, upDateAvatar, login };
