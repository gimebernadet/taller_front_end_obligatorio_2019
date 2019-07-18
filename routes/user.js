const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.post('/', function (req, res, next) {
    UserController.createUser(req.body, (result) => {
        console.log('User create:', result.email);
        res.send(JSON.stringify(result));
    }, err => next(err));

})

router.post('/login', function (req, res, next) {

    UserController.login(req.body, (result) => {
        console.log('User logged-in:', result.email);
        res.send(JSON.stringify(result));
    }, err => next(err));

})

router.post('/logout/:userId', function (req, res, next) {
    console.log('User logged-out', req.params.userId);
    res.status(200).end("User logged out.");
})

router.post('/confirmChampionship/:userId', function (req, res, next) {

    UserController.confirmChampionship(req.params.userId, result => {
        console.log('User confirmChampionship');
        res.send(JSON.stringify(result));
    }, err => next(err));

})

router.use((err, req, res, next) => {
    if (err.isOperational) {
        return res.status(err.status).json(err);
    } else {
        throw err;
    }
});

module.exports = router;