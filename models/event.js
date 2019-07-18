const mongoose = require('mongoose');
const constants = require('../utils/constants')
const EVENT_TYPES = constants.EVENT_TYPES;
const Schema = mongoose.Schema;

const eventSchema = Schema({
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
});

module.exports = {
    createPlayer: mongoose.model('event', eventSchema),
    eventSchema
}