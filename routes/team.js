const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/team');

router.post('/:userId', function (req, res, _) {
    TeamController.createTeam(req, res)
})

router.get('/:teamId', function (req, res, _) {
    TeamController.getById(req, res)
})

router.get('/getAllByChampionshipId/:championshipId', function (req, res, _) {
    TeamController.getAllByChampionshipId(req.params.championshipId, (err, result) => {
        if (err) {
            console.log(`ERROR: TEAMS, getAllByChampionshipId`, err);
            res.status(err.status).end(err.toString());
        } else {
            console.log(`SUCCESS: TEAMS getAllByChampionshipId`);
            res.send(JSON.stringify(result));
        }
    })
})

module.exports = router;