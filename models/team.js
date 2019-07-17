const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const player = require('./player');

const teamSchema = Schema({
    championshipId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                const that = this;
                return new Promise(function (resolve, reject) {
                    that.model('team').count({
                        championshipId: that.championshipId,
                        name: value
                    }, function (err, count) {
                        if (err) {
                            reject(false);
                        }
                        resolve(!count)
                    });
                });
            },
            message: _ => `There is another team with the same name.`
        }
    },
    primaryColor: {
        type: String,
        required: true,
    },
    secondaryColor: {
        type: String,
        required: true,
    },
    players: {
        type: [player.playerSchema],
        validate: {
            validator: function (value) {
                let numbers = value.map(v => v.number)
                return (new Set(numbers)).size == numbers.length;
            },
            message: _ => `Two players with the same number`
        }
    }

});

module.exports = mongoose.model('team', teamSchema);