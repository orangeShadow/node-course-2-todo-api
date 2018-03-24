const {ObjectID} = require('mongodb');

const {mongo} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

let id = '6ab6c45ea1395171aa1e4c4b11';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid!');
    return null;
}

// Todo.find({
//     _id: id
// }).then((todos)=>{
//    console.log('Todos',todos); 
// });


// Todo.findOne({
//     _id: id
// }).then((todo)=>{
//    console.log('Todo',todo); 
// });

Todo.findById(id).then((todo)=>{
    if(!todo) {
        return console.log('Id not found!');
    }
    console.log('Todo By ID',todo); 
 }).catch( (e) => console.log(e) );