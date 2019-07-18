var Match = require('../models/match');
const mongoose = require('mongoose');

module.exports = {
    createMatches: (matches, callback) => {
        Match.create(matches, callback)
    },
    editMatch: (matchId, matchData, success, error) => {
        Match.findById(matchId, (err, match) => {
            if (err) {
                error(new exceptions.InternalError(err))
            } else if (!match) {
                error(new exceptions.ResourceNotFoundError(`Match  ${matchId}`))
            } else {
                if (!match.played) {
                    match.played = true;
                    match.events = matchData.events;

                    let team1_players = [];
                    matchData.team1.players.forEach(p => {
                        team1_players.push(mongoose.Types.ObjectId(p))
                    });
                    match.team1.players = team1_players;

                    match.team1.score = matchData.team1.score;

                    let team2_players = [];
                    matchData.team2.players.forEach(p => {
                        team2_players.push(mongoose.Types.ObjectId(p))
                    });
                    match.team2.players = team2_players;

                    match.team2.score = matchData.team2.score;

                    match.save((err1, result) => {
                        if (err1) {
                            error(new exceptions.InternalError(err1))
                        } else {
                            success(result);
                        }
                    })
                } else {
                    error(new exceptions.MethodNotAllowed('Match already finished.'))
                }
            }
        })
    },
    getById: (matchId, success, error) => {
        Match.findById(matchId, (err, match) => {
            if (err) {
                error(new exceptions.InternalError(err))
            } else if (!match) {
                error(new exceptions.ResourceNotFoundError(`Match  ${matchId}`))
            } else {
                success(match);
            }
        })
    },
    getAllByChampionshipId: (championshipId, callback) => {
        Match.find({
            championshipId: mongoose.Types.ObjectId(championshipId)
        }, callback)
    }
}