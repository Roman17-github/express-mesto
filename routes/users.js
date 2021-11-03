const router = require('express').Router();
const { getUsers, getUser, upDateUser, upDateAvatar } = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  })
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30)
  })
}), upDateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().validate(validator.isURL())
  })
}), upDateAvatar);

module.exports = router;
