const mongoose = require('mongoose');
const constants = require('../utils/constants')
const EVENT_TYPES = constants.EVENT_TYPES;
const Schema = mongoose.Schema;

const matchSchema = Schema({
    championshipId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    played: Boolean,
    team1: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'team',
            required: true
        },
        players: {
            type: [Schema.Types.ObjectId],
            validate: {
                validator: function (value) {
                    const repeated = value.length > 0 ? (new Set(value)).size == value.length : false;
                    const that = this;
                    return new Promise(function (resolve, reject) {
                        that.model('team').findById(
                            that.team1.id,
                            function (err, team) {
                                if (err) {
                                    reject(false);
                                }
                                let exists = true;
                                value.forEach(v => {
                                    return exists && team.players[v]
                                })
                                resolve(!repeated && exists)
                            });
                    });
                },
                message: _ => `A player does not belong to the team`
            }
        }
    },
    team2: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'team',
            required: true
        },
        players: {
            type: [Schema.Types.ObjectId],
            validate: {
                validator: function (value) {
                    const repeated = value.length > 0 ? (new Set(value)).size == value.length : false;
                    const that = this;
                    return new Promise(function (resolve, reject) {
                        that.model('team').findById(
                            that.team2.id,
                            function (err, team) {
                                if (err) {
                                    reject(false);
                                }
                                let exists = true;
                                value.forEach(v => {
                                    return exists && team.players[v]
                                })
                                resolve(!repeated && exists)
                            });
                    });
                },
                message: _ => `A player does not belong to the team`
            }
        }
    },
    events: [{
        playerId: {
            type: Schema.Types.ObjectId,
            ref: 'player'
        },
        minute: {
            type: Number,
            required: true,
            min: 0,
            max: 150
        },
        type: {
            type: String,
            validate: {
                validator: function (value) {
                    return (new Set([EVENT_TYPES.GOAL, EVENT_TYPES.OWN_GOAL, EVENT_TYPES.RED_CARD, EVENT_TYPES.YELLOW_CARD])).has(value)
                },
                message: _ => `Invalid event type ${value}`
            }
        }
    }]
});

module.exports = mongoose.model('match', matchSchema);