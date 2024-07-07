const { Router } = require('express');
const { usersController } = require('../controllers/usersController');

const userRouter = Router();

userRouter.post('/register', usersController.register);

module.exports = { userRouter };