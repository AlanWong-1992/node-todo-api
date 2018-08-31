var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	}
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

// User
// email - require it - trim it - set type - set min length of 1

var User = mongoose.model('User', {
	name: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	}
})

var newUser = new User({
	name: 'Alan'
})

newUser.save().then((doc) => {
	console.log('Saving new User into the db: ');
	console.log(JSON.stringify(doc, undefined, 2));
}, (err) => {
	console.log('Unable to save new user. ', err);
})