var Team = require('../models/team');
const User = require('../models/user');
const playerModel = require('../models/player');
const mongoose = require('mongoose');
const exceptions = require('../utils/exceptions');

module.exports = {
    createTeam: (userId, teamData, success, error) => {
        if(!userId){
            return error(new exceptions.BadRequest('Invalid user data'));
        }
        if(!teamData || !teamData.name || !teamData.championshipId || !teamData.primaryColor || !teamData.secondaryColor || !teamData.players ){
            return error(new exceptions.BadRequest('Invalid team data'));
        }
        User.findById(userId, (err, resultUser) => {
            try {
                if (err) {
                    error(new exceptions.TransactionError(err))
                } else if (!resultUser) {
                    error(new exceptions.ResourceNotFoundError(`User  ${userId}`))
                } else {
                    if (!resultUser.championship.isConfirmed) {
                        const team = new Team();
                        team.name = teamData.name;
                        team.championshipId = resultUser.championship._id;
                        team.primaryColor = teamData.primaryColor;
                        team.secondaryColor = teamData.secondaryColor;

                        let players = [];
                        teamData.players.forEach(p => {
                            const player = new playerModel.createPlayer();
                            player.name = p.name;
                            player.lastName = p.lastName;
                            player.birthDate = p.birthDate;
                            player.number = p.number;
                            players.push(player);
                        })
                        team.players = players;

                        team.save({
                            validateBeforeSave: true
                        }, (err1, result) => {
                            if (err1) {
                                error(new exceptions.TransactionError(err1))
                            } else {
                                success(result);
                            }
                        })
                    } else {
                        error(new exceptions.MethodNotAllowed('Championship already confirmed.'))
                    }
                }
            } catch (err2) {
                error(new exceptions.TransactionError(err2))
            }
        })
    },
    getById: (teamId, success, error) => {
        if(!teamId){
            return error(new exceptions.BadRequest('Invalid team data'));
        }
        Team.findById(teamId, (err, team) => {
            if (err) {
                error(new exceptions.TransactionError(err))
            } else if (!team) {
                error(new exceptions.ResourceNotFoundError(`Team  ${teamId}`))
            } else {
                success(team);
            }
        })
    },
    getAllByChampionshipId: (championshipId, callback) => {
        Team.find({
            championshipId: mongoose.Types.ObjectId(championshipId)
        }, callback)
    }
}