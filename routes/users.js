const router = require('express').Router();
const { getUsers, getUser, upDateUser, upDateAvatar } = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');

router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  })
}), getUser);
router.patch('/me', upDateUser);
router.patch('/me/avatar', upDateAvatar);

module.exports = router;
