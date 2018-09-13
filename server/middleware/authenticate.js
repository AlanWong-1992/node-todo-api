const {User} = require('./../models/user');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var authenticate = (req, res, next) => {
	var token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if (!user) {
			return Promise.reject();
		}

		req.user = user;
		req.token = token;
		next();
	}).catch((err) => {
		res.status(401).send();
	});
};

var authenticateLogin = (req, res, next) => {
	var body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		req.user = user;
		return user.generateAuthToken();
	}).then((token) => {
		req.token = token;
		next();
	}).catch((e) => {
		res.status(400).send();
	});
};

module.exports = {authenticate, authenticateLogin};