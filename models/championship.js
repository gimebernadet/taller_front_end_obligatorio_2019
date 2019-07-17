const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const championshipSchema = Schema({
    isConfirmed: Boolean
});

module.exports = {
    createChampionship: mongoose.model('championship', championshipSchema),
    championshipSchema
}