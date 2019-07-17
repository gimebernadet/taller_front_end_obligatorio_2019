const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value < Date.now();
            },
            message: _ => `Invalid date`
        }
    },
    number: {
        type: Number,
        required: true,
        min: 1,
        max: 99
    }
});

module.exports = {
    createPlayer: mongoose.model('player', playerSchema),
    playerSchema
}