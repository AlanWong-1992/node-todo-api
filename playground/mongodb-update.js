// mongodb-connect.js
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB Server');
	}

	console.log('Connected to MongoDB Server');
	const db = client.db('ToDoApp');

	// update() method in MongoDB Collections
	// db.collection('Todos').update({text: 'Clean Room'}, {$set:{text: 'Clean Bathroom'}}, {multi:true}).then((result) => {
	// 	console.log('Found and Update Results:');
	// 	console.log(JSON.stringify(result, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to find and update', err);
	// })

	// save() method in MongoDB Collections
	// db.collection('Todos').save({
	// 	_id : ObjectId("5b8815d30ca2c8cc5465751c"),
	// 	text: 'Call family',
	// 	completed: true,
	// 	estimatedTimeToComplete: 60
	// }).then((result) => {
	// 	console.log('Found and Update Results:');
	// 	console.log(JSON.stringify(result, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to find and update', err);
	// })

	db.collection('Users').findOneAndUpdate({
		_id : ObjectId("5b881072a68cbb26fa2452e8")
	}, {
		$set:{name: 'Josephine'},
		$inc: {age: 5}
	}, {
		returnOriginal: false
	}
	).then((result) => {
		console.log('Found and Update Results:');
		console.log(JSON.stringify(result, undefined, 2));
	}, (err) => {
		console.log('Unable to find and update', err);
	})

	client.close();
})