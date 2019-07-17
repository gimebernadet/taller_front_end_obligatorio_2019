const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.post('/', function (req, res, _) {
    UserController.createUser(req, res);
})

router.post('/login', function (req, res, _) {
    UserController.login(req, res);
})

router.post('/logout/:userId', function (req, res, _) {
    res.status(200).end("User logged out.");
})

router.post('/confirmChampionship/:userId', function (req, res, next) {
    UserController.confirmChampionship(req, res);
})

module.exports = router;