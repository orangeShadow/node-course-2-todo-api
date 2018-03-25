const express = require('express');
const bodyParse = require('body-parser');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose.js');
const {Todo}  =  require('./models/todo');
const {User}  = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

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

app.get('/todos/:id', (req,res) => {
  let id  = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id is not valid!');
  }

  Todo.findById(id).then((todo)=> {    
    if (!todo) {
      return res.status(404).send('Todo was not found!');
    }

    res.send({todo});
  },(e) => {
    res.status(400).send(e);
  });
});

if(!module.parent){ 
  app.listen(port, () => {
    console.log(`Started up at port {port}`);
  });
}


module.exports = { app };
