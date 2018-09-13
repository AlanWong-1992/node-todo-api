const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
	_id: userOneId,
	email: 'john@gmail.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
	}]
},{
	_id: userTwoId,
	email: 'alan@gmail.com',
	password: 'userTwoPass'

}];


const populateUsers = (done) => {
	
	User.remove({}).then(() => {
		return userOne = new User(users[0]).save();
	}).then(() => {
		return userTwo = new User(users[1]).save();
	}).then((done) => {
		done();
	}).catch((e) => { done();});
}; 

const todos =[{
	_id: new ObjectId(),
	text: 'First Test to Do'
},{
	_id: new ObjectId(),
	text: 'Second Test to Do',
	completed: true,
	completedAt: 333
}];

const populateTodos = (done) => {
	
	Todo.remove({}).then(() => {
		
		return Todo.insertMany(todos);
	}).then(() => done());

}


module.exports = {todos, populateTodos, users, populateUsers};
