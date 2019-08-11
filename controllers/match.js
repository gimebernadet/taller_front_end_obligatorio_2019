var Match = require('../models/match');
var eventModel = require('../models/event');
const mongoose = require('mongoose');
const exceptions = require('../utils/exceptions');

module.exports = {
    createMatches: (matches, callback) => {
        try {
            Match.create(matches, callback)
        } catch (err) {
            callback(_, err);
        }
    },
    editMatch: (matchId, matchData, success, error) => {
        if (!matchId || !matchData || !matchData.events || !matchData.team1 || !matchData.team1.players || !matchData.team2 || !matchData.team2.players) {
            return error(new exceptions.BadRequest('Invalid match data'));
        }
        Match.findById(matchId, (err, match) => {
            try {
                if (err) {
                    error(new exceptions.TransactionError(err))
                } else if (!match) {
                    error(new exceptions.ResourceNotFoundError(`Match  ${matchId}`))
                } else {
                    if (!(match.events && match.events.length > 0)) {

                        let events = [];
                        matchData.events.forEach(e => {
                            const event = new eventModel.createEvent();
                            event.playerId = e.playerId;
                            event.minute = e.minute;
                            event.type = e.type;
                            events.push(event)
                        });
                        match.events = events;

                        let team1_players = [];
                        matchData.team1.players.forEach(p => {
                            team1_players.push(mongoose.Types.ObjectId(p))
                        });
                        match.team1.players = team1_players;

                        let team2_players = [];
                        matchData.team2.players.forEach(p => {
                            team2_players.push(mongoose.Types.ObjectId(p))
                        });
                        match.team2.players = team2_players;

                        match.save((err1, result) => {
                            if (err1) {
                                error(new exceptions.TransactionError(err1))
                            } else {
                                success(result);
                            }
                        })
                    } else {
                        error(new exceptions.MethodNotAllowed('Match already finished.'))
                    }
                }
            } catch (err2) {
                error(new exceptions.TransactionError(err2))
            }
        })
    },
    getById: (matchId, success, error) => {
        if (!matchId) {
            return error(new exceptions.BadRequest('Invalid match data'));
        }
        Match.findById(matchId, (err, match) => {
            if (err) {
                error(new exceptions.TransactionError(err))
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