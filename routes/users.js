const router = require('express').Router();
const { getUsers,getUser,createUser, upDateUser, upDateAvatar } = require('../controllers/users');


router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me',upDateUser);
router.patch('/me/avatar', upDateAvatar);

module.exports = router;
