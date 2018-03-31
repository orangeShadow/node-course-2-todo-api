const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {
    _id: userOneId,
    name: 'Anton',
    email:'anton@example.com',
    password: 'userOnePass',
    tokens: [
      {
        'access':'auth',
        'token': jwt.sign({_id: userOneId.toHexString(), 'access':'auth'}, 'qwety').toString()
      }
    ]
  },
  {
    _id: userTwoId,
    name: 'Yuli',
    email:'yuli@example.com',
    password: 'userTwoPass',
  }
];


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

const populateTodos = (done) => {
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then(() => done()).catch((e)=>{
    done(e);
  });
};

const populateUsers = (done) => {
  User.remove({}).then(()=> {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne,userTwo]).then(()=>{
      done();
    });
  });
};

module.exports = { todos, populateTodos, users, populateUsers };
