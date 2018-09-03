const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server'); 
const {Todo} = require('./../models/todo');
const {user} = require('./../models/user');

const todos =[{
	_id: new ObjectId(),
	text: 'First Test to Do'
},{
	_id: new ObjectId(),
	text: 'Second Test to Do'
}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {
	it('Should Post a Todo to the database', (done) => {
		var text = 'Clean House';
		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((err) => done(err));
			});
	});

	it('Should not create Todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if(err){
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((err) => done(err));

			});
	});
});

describe('GET /todos', () => {
	it('Should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
				expect(res.body.todos[0].text).toBe(todos[0].text);
				expect(res.body.todos[1].text).toBe(todos[1].text);
			})
			.end(done);
	})
});

describe('GET /todos/:id', () => {

	it('Should get a single todo by id', (done) => {

		var id = todos[0]._id.toHexString();
		var link = `/todos/${id}`;
		request(app)
			.get(link)
			.expect(200)
			.expect((res) => {
				console.log(res.body);
				// console.log('id: ', id);
				// console.log(link);
				expect(typeof res.body.todo.text).toBe('string');
				expect(res.body.todo.text).toBe('First Test to Do');
			})
			.end(done)
	});

	it('Should return 404 if invalid id is provided', (done) => {

		var id = '123abc'; // invalid id
		var link = `/todos/${id}`;
		request(app)
			.get(link)
			.expect(404)
			.end(done)
	});

	it('Should return 404 if id is not found in the database', (done) => {

		var id = new ObjectId().toHexString();
		var link = `/todos/${id}`;
		request(app)
			.get(link)
			.expect(404)
			.end(done)
	})
});

describe('DELETE /todos/:id', () => {
	it('Should find a todo by id and delete it', (done) => {

		var id = todos[0]._id.toHexString();
		var link = `/todos/${id}`;
		request(app)
			.delete(link)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo._id).toBe(id)
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(id).then((todo) => {
					expect(todo).toBeNull();
					done();
				}).catch((err) => done(err));
			});
	});

	it('Should return 404 if invalid id is provided', (done) => {

		var id = '123abc'; // invalid id
		var link = `/todos/${id}`;
		request(app)
			.delete(link)
			.expect(404)
			.end(done)
	});

	it('Should return 404 if id is not found in the database', (done) => {

		var id = new ObjectId().toHexString();
		var link = `/todos/${id}`;
		request(app)
			.delete(link)
			.expect(404)
			.end(done)
	})
})