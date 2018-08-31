var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	console.log(req.body);
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (err) => {
		res.status(400).send(e);
	});
});

app.listen(3000, () => {
	console.log('Started on port 3000');
});
// var newTodo = new Todo({
// 	text: '          Go through Node Tutorials            ',
// 	completed: true,
// 	completedAt: 1200
// });

// newTodo.save().then((doc) => {
// 	console.log('Saved todo', doc);
// }, (err) => {
// 	console.log('Unable to save todo:', err);
// });

// var newUser = new User({
// 	name: 'Alan',
// 	email: 'alan@email.com'
// })

// newUser.save().then((doc) => {
// 	console.log('Saving new User into the db: ');
// 	console.log(JSON.stringify(doc, undefined, 2));
// }, (err) => {
// 	console.log('Unable to save new user. ', err);
// })