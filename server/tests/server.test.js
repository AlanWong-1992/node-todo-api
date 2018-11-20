const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('Should Post a Todo to the database', (done) => {
    var text = 'Clean House';
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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

  it('Should not create Todo', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end(done);
  });
});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
        expect(res.body.todos[0].text).toBe(todos[0].text);
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });

  it('Should return 404 if id is not found in the database', (done) => {

    var id = new ObjectId().toHexString();
    var link = `/todos/${id}`;
    request(app)
      .get(link)
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });

  it('Should return 404 if id is not found in the database', (done) => {

    var id = new ObjectId().toHexString();
    var link = `/todos/${id}`;
    request(app)
      .delete(link)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update id setting completed to true and completedAt should be a number', (done) => {
    var id = todos[0]._id.toHexString();
    var link = `/todos/${id}`;
    var body = {
      "text": `${todos[0].text}`,
      "completed": true
    }

    request(app)
      .patch(link)
      .set('x-auth', users[0].tokens[0].token)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done)
  });

  it('Should update id setting completed to false and completedAt should be null', (done) => {
    var id = todos[1]._id.toHexString();
    var link = `/todos/${id}`;
    var body = {
      "text": `${todos[1].text}`,
      "completed": false
    }

    request(app)
      .patch(link)
      .set('x-auth', users[1].tokens[0].token)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[1].text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done)
  });

  it('Should return 404 if invalid id is provided', (done) => {

    var id = '123abc'; // invalid id
    var link = `/todos/${id}`;
    request(app)
      .patch(link)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });

  it('Should return 404 if text property in the body is not set', (done) => {
    var id = todos[1]._id.toHexString();
    var link = `/todos/${id}`;
    var body = {};
    request(app)
      .patch(link)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });

})

describe('GET /users/me', () => {
  it('Should bring up a new user if authenticated', (done) => {

    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
      })
      .end(done);
  });

  it('Should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done)
  });
})

describe('POST /users', () => {
  it('Should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email)
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.find({email}).then((user) => {
          expect(user.length).toBe(1);
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Return 400 if supplying an already registered email', (done) => {
    var email = users[0].email;
    var password = '123mnb!';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });

  it('Return 400 if email and/or password fails validation', (done) => {
    var email = 'email123';
    var password = 'abc';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });
});

describe('POSTS /users/login', () => {
  it('Should return user with a token', (done) => {
    var email = 'john@gmail.com';
    var password = 'userOnePass';
    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(email);
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          expect(user.tokens[0].token).toMatch(res.headers['x-auth']);
          done();
        }).catch((e) => console.log(e));
      });
  });

  it('Should return 400 if the wrong email and/or password is supplied', (done) => {
    var email = 'email123@email.com';
    var password = 'wrongPassword';
    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(400)
      .end(done)
    });
});

describe('DEL /users/me/token', () => {
  it('Should delete the token from the user', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done()
        }).catch((e) => console.log(e));
      });
  });
});
