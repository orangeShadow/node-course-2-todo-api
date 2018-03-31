const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos,populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Text todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

  it('should not create todo with invalid body data', (done) => {
       request(app)
      .post('/todos')
      .send({
        "text":""
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.errors.text.message).toBe("Path `text` is required.");
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect( (res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect( (res) => {
        //expect(JSON.stringify(res.body.todo)).toEqual(JSON.stringify(todo));
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${(new ObjectID).toHexString()}`)
      .expect(404)
      .expect( (res) => {
        expect(res.text).toBe('Todo was not found!');
      })
      .end(done);
  });

  it('should return 404 if id is not valid', (done) => {
    request(app)
      .get(`/todos/wfsdfw23423sdfsdfsdf432454`)
      .expect(404)
      .expect( (res) => {
        expect(res.text).toBe('Id is not valid!');
      })
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove todo ', (done) => {
    let hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect( (res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end( (err, res) => {
        if(err) {
          return done(err);
        }

        Todo.findById(hexId).then( (todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${(new ObjectID).toHexString()}`)
      .expect(404)
      .expect( (res) => {
        expect(res.text).toBe('Todo was not found!');
      })
      .end(done);
  });

  it('should return 404 if id is not valid', (done) => {
    request(app)
      .delete(`/todos/wfsdfw23423sdfsdfsdf432454`)
      .expect(404)
      .expect( (res) => {
        expect(res.text).toBe('Id is not valid!');
      })
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update todo ', (done) => {
    let hexId = todos[0]._id.toHexString();
    let updateTodo = {
      text:"Test",
      completed: true
    }

    request(app)
      .patch(`/todos/${hexId}`)
      .send(updateTodo)
      .expect(200)
      .expect( (res) => {
        expect(res.body.todo.text).toBe(updateTodo.text);
        expect(res.body.todo.completed).toBe(updateTodo.completed);
        expect(res.body.todo.completedAt).toBeDefined();
      })
      .end(done);
  });

  it('should clear completedAt when is not completed', (done) => {
    let hexId = todos[1]._id.toHexString();
    let updateTodo = {
      completed: false
    }

    request(app)
      .patch(`/todos/${hexId}`)
      .send(updateTodo)
      .expect(200)
      .expect( (res) => {
        expect(res.body.todo.completed).toBe(updateTodo.completed);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${(new ObjectID).toHexString()}`)
      .expect(404)
      .expect( (res) => {
        expect(res.text).toBe('Todo was not found!');
      })
      .end(done);
  });

  it('should return 404 if id is not valid', (done) => {
    request(app)
      .delete(`/todos/wfsdfw23423sdfsdfsdf432454`)
      .expect(404)
      .expect( (res) => {
        expect(res.text).toBe('Id is not valid!');
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a new user', (done) => {


    let body = {
        "name":"John Do",
        "email": "johndo@test.com",
        "password": "123qwe!"
    };

    request(app)
      .post('/users')
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(body.email);
        expect(res.body.name).toBe(body.name);
      })
      .end((err,res) => {
        if (err) {
          return done(err);
        }

        User.findOne({email:body.email}).then((user) => {
          expect(users).toBeTruthy();
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

  it('should return validation errors if request invalid', (done) => {

    let body = {
        "name":"John Do",
        "email": "johndotest.com",
        "password": "123qwe!"
    };

    request(app)
      .post('/users')
      .send(body)
      .expect(400);

    body.name="";
    body.email = "johndo@test.com",

    request(app)
      .post('/users')
      .send(body)
      .expect(400)
      .end(done);

  });

  it('should not create user if email is use', (done) => {
    let body = {
      "name":"John Do",
      "email": users[0].email,
      "password": "123qwe!"
    };

    request(app)
      .post('/users')
      .send(body)
      .expect(400)
      .end(done);

  });

});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set({'x-auth':users[0].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);

  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and set status x-auth', (done) => {
    request(app)
      .post('/users/login')
      .send({email:users[1].email, password:users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err,res) => {
        if(res) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
            expect(user.tokens[0]).toInclude({
              'access':'auth',
              'token': res.headers['x-auth']
            });
            done();
        }).catch( (e) => done(e) );
      });

  });

  it('should return fail if password is wrong', (done) => {
    request(app)
      .post('/users/login')
      .send({email:users[0].email, password:'324dsf'})
      .expect(400)
      .expect((res)=>{
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err,res) => {
        if(res) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
        }).catch( (e) => done(e) );
      });

  });
});
