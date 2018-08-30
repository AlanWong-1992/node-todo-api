// mongodb-connect.js
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB Server');
	}

	console.log('Connected to MongoDB Server');
	const db = client.db('ToDoApp');

	// db.collection('Users').deleteMany({name: 'Alan'}).then((result) => {
	// 	console.log('Successfully deleted items');
	// 	console.log(JSON.stringify(result, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to delete items: ', err);
	// });

	db.collection('Users').findOneAndDelete({_id: 1234}).then((result) => {
		console.log('Found and Delete Results: ');
		console.log(result);
	}, (err) => {
		console.log('Unable to find and delete', err);
	})

	client.close();
})