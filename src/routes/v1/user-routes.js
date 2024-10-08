const express = require('express');
const { UserController } = require('../../controllers');
const { AuthRequestMiddlewares } = require('../../middlewares');
const router = express.Router();

router.post('/user',AuthRequestMiddlewares.validateAuthRequest, UserController.signup);


module.exports = router;