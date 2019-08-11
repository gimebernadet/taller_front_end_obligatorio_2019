const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const event = require('./event');

const matchSchema = Schema({
    championshipId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    team1: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'team',
            required: true
        },
        players: {
            type: [Schema.Types.ObjectId]
            // validate: {
            //     validator: function (value) {
            //         const repeated = value.length > 0 ? (new Set(value)).size == value.length : false;
            //         const that = this;
            //         return new Promise(function (resolve, reject) {
            //             that.model('team').findById(
            //                 that.team1.id,
            //                 function (err, team) {
            //                     if (err) {
            //                         reject(false);
            //                     }
            //                     let exists = true;
            //                     value.forEach(v => {
            //                         return exists && team.players[v]
            //                     })
            //                     resolve(!repeated && exists)
            //                 });
            //         });
            //     },
            //     message: _ => `A player does not belong to the team`
            // }
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
            // validate: {
            //     validator: function (value) {
            //         const repeated = value.length > 0 ? (new Set(value)).size == value.length : false;
            //         const that = this;
            //         return new Promise(function (resolve, reject) {
            //             that.model('team').findById(
            //                 that.team2.id,
            //                 function (err, team) {
            //                     if (err) {
            //                         reject(false);
            //                     }
            //                     let exists = true;
            //                     value.forEach(v => {
            //                         return exists && team.players[v]
            //                     })
            //                     resolve(!repeated && exists)
            //                 });
            //         });
            //     },
            //     message: _ => `A player does not belong to the team`
            // }
        }
    },
    events: {
        type: [event.eventSchema],
        // validate: {
        //     validator: function (events) {
        //         const that = this;
        //         return new Promise(function (resolve, reject) {
        //             var p1 = new Promise(function (res, rej) {
        //                 that.model('team').findById(
        //                     that.team1.id,
        //                     function (err, team) {
        //                         if (err) {
        //                             rej(false);
        //                         }
        //                         res(team)
        //                     });
        //             });
        //             var p2 = new Promise(function (res, rej) {
        //                 that.model('team').findById(
        //                     that.team2.id,
        //                     function (err, team) {
        //                         if (err) {
        //                             res(false);
        //                         }
        //                         rej(team)
        //                     });
        //             });

        //             Promise.all([p1, p2]).then(result => {
        //                 const team1Players = result[0].players
        //                 const team2Players = result[1].players
        //                 const players = team1Players.concat(team2Players);
        //                 events.forEach(event => {
        //                     const player = players.find(p => p._id === event.playerId)
        //                     if (!player) {
        //                         reject(false);
        //                     }
        //                     resolve(player)
        //                 })

        //             });
        //         })
        //     },
        //     message: _ => `A player does not belong to teams.`
        // }
    }
});

module.exports = mongoose.model('match', matchSchema);