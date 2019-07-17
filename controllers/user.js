const User = require('../models/user');
var Match = require('../models/match');
const bcrypt = require('bcrypt');
var championshipModel = require('../models/championship');
const TeamController = require('../controllers/team');
const MatchController = require('../controllers/match');
const mongoose = require('mongoose');

module.exports = {
    createUser: (req, res) => {
        let userData = req.body
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(userData.password, salt);
        userData.password = hash;

        const user = new User();
        user.name = userData.name;
        user.password = hash;
        user.email = userData.email;

        const championship = new championshipModel.createChampionship();
        championship.isConfirmed = false;
        user.championship = championship;

        user.save({
            validateBeforeSave: true
        }, err => {
            if (err) {
                console.log('User save error:', err);
                res.status(500).end('User save error');
            } else {
                user.password = "********";
                console.log('User created:', user);
                res.send(JSON.stringify(user));
            }
        })
    },
    login: (req, res) => {
        User.findOne({
            email: req.body.email
        }, (err, result) => {
            if (err || !result) {
                console.log('User or password is not correct 1.', req.body.email);
                res.status(401).end("User or password is not correct.");
            } else {
                const login = bcrypt.compareSync(req.body.password, result.password);
                if (login) {
                    console.log('User logged-in:', req.body.email);
                    result.password = "********";
                    res.send(JSON.stringify(result));
                } else {
                    console.log('User or password is not correct 2.', req.body.email);
                    res.status(401).end("User or password is not correct.");
                }
            }
        })
    },
    getUser: (userId, callback) => {
        return User.findById(userId, callback)
    },
    confirmChampionship: (req, res) => {
        User.findById(req.params.userId, (err1, user) => {
            if (err1) {
                console.log('User get error:', err1);
                res.status(500).end("Internal server error.");
            } else if (!user) {
                console.log('User not found.', err1);
                res.status(401).end("User not found.");
            } else if (!user.championship.isConfirmed) {
                TeamController.getAllByChampionshipId(user.championship._id, (err2, teams) => {
                    if (err2) {
                        console.log('Get Teams error', err2);
                        res.status(500).end("Internal server error.");
                    } else if (!teams || teams.length < 5) {
                        console.log('Not enought teams, count:', teams.length);
                        res.status(401).end("There are not enougth teams.");
                    } else {
                        let matches = [];
                        for (let i = 0; i < teams.length; i++) {
                            for (let j = i + 1; j < teams.length; j++) {
                                const t1 = teams[i];
                                const t2 = teams[j];

                                const match = {
                                    championshipId: mongoose.Types.ObjectId(user.championship._id),
                                    played: false,
                                    events: [],
                                    team1: {
                                        id: t1._id,
                                        players: [],
                                        score: 0
                                    },
                                    team2: {
                                        id: t2._id,
                                        players: [],
                                        score: 0
                                    },
                                }
                                matches.push(new Match(match))
                            }
                        }
                        MatchController.createMatches(matches, (err3, result) => {
                            if (err3 || !result) {
                                console.log('Match create error', err3);
                                res.status(500).end("Internal server error.");
                            } else {
                                console.log('Matches created')
                                user.championship.isConfirmed = true;
                                user.save();
                                res.send(JSON.stringify(result));
                            }
                        })
                    }
                })
            } else {
                console.log('Championship already confirmed.');
                res.status(401).end("Championship already confirmed.");
            }
        })
    }
}