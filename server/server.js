var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
var {ObjectId} = require('mongodb');
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
		res.status(400).send(err);
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, (err) => {
		res.status(400).send(err);
	})
})

app.get('/todos/:id', (req, res) => {
	console.log(req.params.id);
	var id = req.params.id;

	if (!ObjectId.isValid(id)) {
		return res.status(404).send()
	}

	Todo.findById(id).then((todo) => {
		
		if (!todo) {
			return res.status(404).send();
		}

		return res.status(200).send({todo})

	}).catch((err) => {
		return res.status(400).send();
	})

})

app.listen(3000, () => {
	console.log('Started on port 3000');
});

module.exports = {app};