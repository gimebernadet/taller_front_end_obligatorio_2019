var Team = require('../models/team');
const User = require('../models/user');
const playerModel = require('../models/player');
const mongoose = require('mongoose');

module.exports = {
    createTeam: (userId, teamData, success, error) => {
        User.findById(userId, (err, resultUser) => {
            if (err) {
                error(new exceptions.InternalError(err))
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
                            error(new exceptions.InternalError(err1))
                        } else {
                            success(result);
                        }
                    })
                } else {
                    error(new exceptions.MethodNotAllowed('Championship already confirmed.'))
                }
            }
        })
    },
    getById: (teamId, success, error) => {
        Team.findById(teamId, (err, team) => {
            if (err) {
                error(new exceptions.InternalError(err))
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