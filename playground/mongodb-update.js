const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');
  var db = client.db('TodoApp');

  const collection  = db.collection('Users');

  collection.findOneAndUpdate(
    {
      "_id": new ObjectID('5a860b0ef6d20e3d05b09d4d')
    },
    {
      $set:{
        name:'Anton'
      },
      $inc:{
        age:2
      }
    },
    {
      returnOriginal: false
    }
  ).then((result)=>{
    console.log(result);
  })

  client.close();
});
