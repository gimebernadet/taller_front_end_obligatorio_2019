const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/match');

router.put('/:matchId', function (req, res, _) {
    MatchController.editMatch(req, res)
})

router.get('/:matchId', function (req, res, _) {
    MatchController.getById(req, res)
})

router.get('/getAllByChampionshipId/:championshipId', function (req, res, _) {
    MatchController.getAllByChampionshipId(req.params.championshipId, (err, result) => {
        if (err) {
            console.log(`ERROR: MATCH, getAllByChampionshipId`, err);
            res.status(err.status).end(err.toString());
        } else {
            console.log(`SUCCESS: MATCH getAllByChampionshipId ${result}`);
            res.send(JSON.stringify(result));
        }
    })
})

//error handling

module.exports = router;