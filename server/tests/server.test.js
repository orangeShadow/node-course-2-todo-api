const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
  {
    text: 'Frist test todo'
  },
  {
    text: 'Second test todo'
  }
];

beforeEach( (done) => {
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then(() => done());

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
  it('should get direct todo', (done) => {    
    Todo.findOne().then((todo)=>{ 
      request(app)
        .get('/todos/'+todo.id)
        .expect(200)
        .expect( (res) => {          
          expect(JSON.stringify(res.body.todo)).toEqual(JSON.stringify(todo));
        })
        .end(done);
    });
    
  });  
});