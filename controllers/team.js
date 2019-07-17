var Team = require('../models/team');
const User = require('../models/user');
const playerModel = require('../models/player');
const mongoose = require('mongoose');

module.exports = {
    createTeam: (req, res) => {
        User.findById(req.params.userId, (err, resultUser) => {
            if (err) {
                console.log('User get error:', err);
                res.status(err.status).end(err.toString());
            } else if (!resultUser) {
                console.log('User not found', req.params.userId);
                res.status(400).end('User not found');
            } else {
                if (!resultUser.championship.isConfirmed) {
                    const team = new Team();
                    team.name = req.body.name;
                    team.championshipId = resultUser.championship._id;
                    team.primaryColor = req.body.primaryColor;
                    team.secondaryColor = req.body.secondaryColor;

                    let players = [];
                    req.body.players.forEach(p => {
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
                    }, (error, result) => {
                        if (error) {
                            console.log('Team save error:', error);
                            res.status(500).end('Team save error');
                        } else {
                            console.log('Team created:', result);
                            res.send(JSON.stringify(result));
                        }
                    })
                } else {
                    res.status(403).end('Forbidden: Championship closed');
                }
            }
        })
    },
    getById: (req, res) => {
        Team.findById(req.params.teamId, (err, team) => {
            if (err) {
                console.log('Team get error:', err);
                res.status(err.status).end(err.toString());
            } else if (!team) {
                console.log('Team not found', req.params.teamId);
                res.status(400).end('Team not found');
            } else {
                console.log('Get Team by id:', team);
                res.send(JSON.stringify(team));
            }
        })
    },
    getAllByChampionshipId: (championshipId, callback) => {
        Team.find({
            championshipId: mongoose.Types.ObjectId(championshipId)
        }, callback)
    }
}