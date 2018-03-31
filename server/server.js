require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParse = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose.js');
const {Todo}  =  require('./models/todo');
const {User}  = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();

const port = process.env.PORT;

app.use(bodyParse.json());

app.post('/todos', authenticate, (req,res) => {

  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then( (doc) =>{
      res.send(doc);
  }, (e) => {
      res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req,res) => {
  Todo.find({
    _creator:req.user._id
  }).then((todos)=> {
    res.send({todos});
  },(e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate,(req,res) => {
  let id  = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id is not valid!');
  }

  Todo.findOne({ _id:id , _creator: req.user._id }).then((todo)=> {
    if (!todo) {
      return res.status(404).send('Todo was not found!');
    }

    res.send({todo});
  },(e) => {
    res.status(400).send(e);
  });
});

app.delete('/todos/:id', authenticate, (req,res) => {
  let id  = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id is not valid!');
  }

  Todo.findOneAndRemove({ _id:id , _creator: req.user._id }).then((todo)=> {
    if (!todo) {
      return res.status(404).send('Todo was not found!');
    }

    res.send({todo});
  },(e) => {
    res.status(400).send(e);
  });
});

app.patch('/todos/:id', authenticate,(req,res) => {
  let id  = req.params.id;
  let body = _.pick(req.body,['text','completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id is not valid!');
  }

  if( _.isBoolean(body.completed) && body.completed ) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({ _id:id , _creator: req.user._id }, {$set: body}, {new: true}).then((todo)=> {
    if (!todo) {
      return res.status(404).send('Todo was not found!');
    }

    res.send({todo});
  },(e) => {
    res.status(400).send(e);
  });
});

app.post('/users', (req,res) => {

  var body = _.pick(req.body,['name','email','password']);
  var user = new User(body);

  user.save().then( () =>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth', token).send(user);
  })
  .catch( (e) => {
      res.status(400).send(e);
  });
});

app.get('/users/me', authenticate,(req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req,res) => {
  let body = _.pick(req.body,['email','password']);

  User.findByCredentials(body.email, body.password).then( (user) => {
        return user.generateAuthToken().then( (token) =>{
          res.header('x-auth', token).send(user);
        });
      }).catch((e) => {
        res.status(400).send();
      });

});

app.delete('/users/me/token', authenticate,(req,res) => {
  req.user.removeToken(req.token).then( ()=>{
      res.status(200).send();
  },() =>{
    res.status(400).send();
  });
});

if(!module.parent){
  app.listen(port, () => {
    console.log(`Started up at port ${port}`);
  });
}

module.exports = { app };
