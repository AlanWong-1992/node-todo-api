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

	// User.findOne({email: body.email}).then((user) => {
	// 	bcrypt.compare(body.password, user.password, (err, result) => {
	// 		console.log('Password equals: ', result);
	// 		req.user = user.email;
	// 		req.token = user.tokens[0].token;
	// 		next();
	// 	});
	// }).catch((e) => res.status(401).send(e));
};

module.exports = {authenticate, authenticateLogin};