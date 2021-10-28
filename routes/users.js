const router = require('express').Router();
const { getUsers,getUser, upDateUser, upDateAvatar } = require('../controllers/users');


router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me',upDateUser);
router.patch('/me/avatar', upDateAvatar);

module.exports = router;
