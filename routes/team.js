const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/team');

router.post('/:userId', function (req, res, next) {
    TeamController.createTeam(req.params.userId, req.body, (result) => {
        console.log('Team create:', result);
        res.send(JSON.stringify(result));
    }, err => next(err))
})

router.get('/:teamId', function (req, res, next) {
    TeamController.getById(req.params.teamId, (result) => {
        console.log('Team getById:', result);
        res.send(JSON.stringify(result));
    }, err => next(err))

})

router.get('/getAllByChampionshipId/:championshipId', function (req, res, next) {
    if(!req.params.championshipId){
        return error(new exceptions.BadRequest('Invalid championship data'));
    }
    TeamController.getAllByChampionshipId(req.params.championshipId, (err, result) => {
        if (err) {
            next(new exceptions.InternalError(err))
        } else {
            console.log(`Team getAllByChampionshipId ${req.params.championshipId}`);
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