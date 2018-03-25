const {ObjectID} = require('mongodb');

const {mongo} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then( (result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove({"_id":""}).then( (result) => {

// });

Todo.findByIdAndRemove('5ab7f9314075bec6d61c1d97').then( (todo) => {
    console.log(todo);
});