const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB Server');
	}

	console.log('Connected to MongoDB Server');
	const db = client.db('ToDoApp');

	db.collection('Users').find({name:'Tracy'}).toArray().then((docs) => {
		console.log(`Users`);
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to fetch data, ', err);
	});

	// db.collection('Users').insertOne({
	// 	name: 'Alan',
	// 	age: 26,
	// 	location: 'Manchester, UK'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert user,', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
	// });

	client.close();
})