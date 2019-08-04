const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/match');

router.put('/:matchId', function (req, res, next) {
    MatchController.editMatch(req.params.matchId, req.body, (result) => {
        console.log('Match finish:', result);
        res.send(JSON.stringify(result));
    }, err => next(err))
})

router.get('/:matchId', function (req, res, next) {
    MatchController.getById(req.params.matchId, (result) => {
        console.log('Match getById:', result);
        res.send(JSON.stringify(result));
    }, err => next(err))
})

router.get('/getAllByChampionshipId/:championshipId', function (req, res, next) {
    if(!req.params.championshipId){
        return error(new exceptions.BadRequest('Invalid championship data'));
    }
    MatchController.getAllByChampionshipId(req.params.championshipId, (err, result) => {
        if (err) {
            next(new exceptions.TransactionError(err))
        } else {
            console.log(`Match getAllByChampionshipId ${req.params.championshipId}`);
            res.send(JSON.stringify(result));
        }
    })
})

router.use((err, req, res, next) => {
    if (err.isOperational) {
        return res.status(err.status).json(err);
    } else {
        throw err;
    }
});

module.exports = router;