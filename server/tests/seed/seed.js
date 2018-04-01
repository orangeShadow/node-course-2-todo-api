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
        _id: new ObjectID().toHexString(),
        'access':'auth',
        'token': jwt.sign({_id: userOneId.toHexString(), 'access':'auth'}, process.env.JWT_SECRET).toString()
      }
    ]
  },
  {
    _id: userTwoId,
    name: 'Yuli',
    email:'yuli@example.com',
    password: 'userTwoPass',
    tokens: [
      {
        _id: new ObjectID().toHexString(),
        'access':'auth',
        'token': jwt.sign({_id: userTwoId.toHexString(), 'access':'auth'}, process.env.JWT_SECRET).toString()
      }
    ]
  }
];


const todos = [
  {
    _id: new ObjectID(),
    text: 'Frist test todo',
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 3333,
    _creator: userTwoId
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
