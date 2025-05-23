const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create', userController.createUser);
router.post('/registro/create', userController.registerUser);
router.put('/update', userController.updateUser);
router.get('/users', userController.getUsers);
router.put('/delete', userController.deleteUser);
module.exports = router;