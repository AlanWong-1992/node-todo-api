const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectId} = require('mongodb');

// Todos collection query
// var id = "7b8950e17ce45d217d731b0f12 ";

// if(ObjectId.isValid(id)){

// 	Todo.findById(id).then((todo) => {

// 		if(!todo){
// 			return console.log('Id not found');
// 		}
		
// 		console.log('Todo: ', todo.text);

// 	}).catch((err) => console.log(err));

// } else {
// 	console.log('the id is not valid.');
// };

// Users collection Query
var id = "5b8944404e205c22d577554";

if(ObjectId.isValid(id)){

	User.findById(id).then((user) => {

		if(!user){
			return console.log('Id not found');
		}
		
		console.log('user: ', user.email);

	}).catch((err) => console.log(err));

} else {
	console.log('the id is not valid.');
};

// Todo.findOne({text: "Second Test to Do"}).then((todo) => {
// 	console.log('Todo: ', todo.text);
// }).catch((err) => console.log(err));

// (err, doc) => {

// 	if(err) {
// 		console.log('Unable to find doc', err);
// 	} else {
// 		console.log('Todo: ', doc.text);
// 	}


// }