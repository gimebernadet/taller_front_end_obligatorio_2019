var Match = require('../models/match');
const mongoose = require('mongoose');

module.exports = {
    createMatches: (matches, callback) => {
        console.log(matches)
        Match.create(matches, callback)
    },
    editMatch: (req, res) => {
        Match.findById(req.params.matchId, (err, match) => {
            if (err) {
                console.log('Match get error:', err);
                res.status(err.status).end(err.toString());
            } else if (!match) {
                console.log('Match not found', req.params.matchId);
                res.status(400).end('Match not found');
            } else {
                if (!match.played) {
                    match.played = true;
                    match.events = req.body.events;

                    let team1_players = [];
                    req.body.team1.players.forEach(p => {
                        team1_players.push(mongoose.Types.ObjectId(p))
                    });
                    match.team1.players = team1_players;

                    match.team1.score = req.body.team1.score;

                    let team2_players = [];
                    req.body.team2.players.forEach(p => {
                        team2_players.push(mongoose.Types.ObjectId(p))
                    });
                    match.team2.players = team2_players;

                    match.team2.score = req.body.team2.score;

                    match.save((err1, result) => {
                        if (err1) {
                            console.log('Match save error:', err1);
                            res.status(err1.status).end(err.toString());
                        } else {
                            res.send(JSON.stringify(result));
                        }
                    })
                } else {
                    console.log('Match already finished.');
                    res.status(401).end("Match already finished.");
                }
            }
        })
    },
    getById: (req, res) => {
        Match.findById(req.params.matchId, (err, match) => {
            if (err) {
                console.log('Match get error:', err);
                res.status(err.status).end(err.toString());
            } else if (!match) {
                console.log('Match not found', req.params.matchId);
                res.status(400).end('Match not found');
            } else {
                console.log('Get Match by id:', match);
                res.send(JSON.stringify(match));
            }
        })
    },
    getAllByChampionshipId: (championshipId, callback) => {
        console.log('championshipId', championshipId)
        Match.find({
            championshipId: mongoose.Types.ObjectId(championshipId)
        }, callback)
    }
}