const {MongoClient, ObjectID} = require('mongodb');

let obj = new ObjectID();
console.log(obj);

// MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
//   if(err) {
//     return console.log('Unable to connect to MongoDB server');
//   }

//   console.log('Connected to MongoDB server');
//   var db = client.db('TodoApp');

//   const collection  = db.collection('Users')
//   collection.insertOne({
//     name: 'Anton Alexeev', age: 32, location: 'Rostov-on-Don'
//   }, (err, result) => {
//     if(err) {
//       return console.log('Unable to insert todo',err);
//     }

//     console.log(JSON.stringify(result.ops, undefined, 2));
//   });

//   client.close();
// });
