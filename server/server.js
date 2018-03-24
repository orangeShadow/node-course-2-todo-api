const express = require('express');
const bodyParse = require('body-parser');

const {mongoose} = require('./db/mongoose.js');
const {Todo}  =  require('./models/todo');
const {User}  = require('./models/user');

const app = express();

app.use(bodyParse.json());

app.post('/todos', (req,res) => {
  let todo = new Todo(req.body);

  todo.save().then( (doc) =>{
      res.send(doc);
  }, (e) => {
      res.status(400).send(e);
  });
});

app.get('/todos', (req,res) => {
  Todo.find().then((todos)=> {
    res.send({todos});
  },(e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = { app };
