require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
var {ObjectId} = require('mongodb');
var {authenticate, authenticateLogin} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
	console.log(req.body);
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (err) => {
		res.status(400).send(err);
	});
});

app.get('/todos', authenticate, (req, res) => {
	Todo.find({
		_creator: req.user._id
	}).then((todos) => {
		res.send({todos});
	}, (err) => {
		res.status(400).send(err);
	})
});

app.get('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;

	if (!ObjectId.isValid(id)) {
		return res.status(404).send()
	}

	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		
		if (!todo) {
			return res.status(404).send();
		}

		return res.status(200).send({todo})


	}).catch((err) => {
		return res.status(400).send();
	})

});

app.delete('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;

	if (!ObjectId.isValid(id)) {
		return res.status(404).send()
	}

	Todo.findOneAndDelete({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {

		if (!todo) {
			return res.status(404).send();
		}

		return res.status(200).send({todo})
	}).catch((err) => {
		return res.status(400).send();
	})

});

app.patch('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectId.isValid(id)) {
		return res.status(404).send();
	}

	if (_.isNil(body.text)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		var timestamp = _.now();
		var date = new Date(timestamp);
		body.completedAt = date;
		
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id 
	}, {$set: body}, {new: true}).then((todo) => {

		if (!todo) {
			return res.status(404).send();
		}

		res.send({todo});
	}).catch((err) => res.status(400).send());
});

app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((err) => res.status(400).send(err));
});


app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

app.post('/users/login', authenticateLogin, (req, res) => {
	res.header('x-auth', req.token).send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	});
})

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};