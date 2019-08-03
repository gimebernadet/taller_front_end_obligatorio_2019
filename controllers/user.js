const User = require('../models/user');
var Match = require('../models/match');
const bcrypt = require('bcrypt');
var championshipModel = require('../models/championship');
const TeamController = require('../controllers/team');
const MatchController = require('../controllers/match');
const mongoose = require('mongoose');
const exceptions = require('../utils/exceptions');

module.exports = {
    createUser: (userData, success, error) => {
        if (!userData || !userData.name || !userData.email || !userData.password || userData.password.length < 8) {
            return error(new exceptions.BadRequest('Invalid user data'));
        }
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
        }, (err, result) => {
            if (err) {
                error(new exceptions.InternalError(err))
            } else {
                success(result)
            }
        })
    },
    login: (userData, success, error) => {
        if (!userData || !userData.email || !userData.password) {
            return error(new exceptions.BadRequest('Invalid user data'));
        }
        User.findOne({
            email: userData.email
        }, (err, result) => {
            if (err) {
                error(new exceptions.InternalError(err))
            } else if (!result) {
                error(new exceptions.ResourceNotFoundError(`User  ${userData.email}`))
            } else {
                const login = bcrypt.compareSync(userData.password, result.password);
                if (login) {
                    success(result)
                } else {
                    error(new exceptions.LoginError('User or password is not correct.'))
                }
            }
        })
    },
    getUser: (userId, callback) => {
        return User.findById(userId, callback)
    },
    confirmChampionship: (userId, success, error) => {
        if (!userId) {
            return error(new exceptions.BadRequest('Invalid user data'));
        }
        User.findById(userId, (err1, user) => {
            try {
                if (err1) {
                    error(new exceptions.InternalError(err1))
                } else if (!user) {
                    error(new exceptions.ResourceNotFoundError(`User  ${userId}`))
                } else if (!user.championship.isConfirmed) {

                    TeamController.getAllByChampionshipId(user.championship._id, (err2, teams) => {
                        if (err2) {
                            error(new exceptions.InternalError(err2))
                        } else if (!teams || teams.length < 5) {
                            error(new exceptions.MethodNotAllowed(`Not enought teams, needs 5 and has: ${teams.length}`))
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
                                    error(new exceptions.InternalError(err3))
                                } else {
                                    user.championship.isConfirmed = true;
                                    user.save((err4, _) => {
                                        if (err4) {
                                            error(new exceptions.InternalError(err4))
                                        } else {
                                            success(result)
                                        }
                                    });
                                }
                            })
                        }
                    })
                } else {
                    error(new exceptions.MethodNotAllowed('Championship already confirmed.'))
                }
            } catch (err4) {
                error(new exceptions.InternalError(err2))
            }
        })
    }
}