const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const todos = [
  {
    _id: new ObjectID(),
    text: 'Frist test todo',
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 3333
  }
];

beforeEach( (done) => {
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then(() => done()).catch((e)=>{dine(e);});

  User.remove({}).then( () =>{

  });
});

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
    
    User.remove({});

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
        expect(res.body.email).toBe(body.email);
        expect(res.body.name).toBe(body.name);
      })
      .end((err,res) => {
        if (err) {
          return done(err);
        }

        User.find({email:body.email}).then((users) => {
          expect(users.length).toBe(1);
          expect(users[0].email).toBe(body.email);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

  // it('should not create todo with invalid body data', (done) => {
  //      request(app)
  //     .post('/todos')
  //     .send({
  //       "text":""
  //     })
  //     .expect(400)
  //     .expect((res) => {
  //       expect(res.body.errors.text.message).toBe("Path `text` is required.");
  //     })
  //     .end((err, res) => {
  //       if (err) {
  //         return done(err);
  //       }

  //       Todo.find().then((todos) => {
  //         expect(todos.length).toBe();
  //         done();
  //       }).catch((e) => {
  //         done(e);
  //       });
  //     });
  // });
});