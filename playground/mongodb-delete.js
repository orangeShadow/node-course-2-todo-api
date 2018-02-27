const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');
  var db = client.db('TodoApp');

  const collection  = db.collection('Todos');

  //collection.deleteOne({text:'Eat lunch'}).then((res)=>{});
  //collection.deleteMany({text:'Eat lunch'}).then((res)=>{});
  //collection.findOneAndDelete({"complete" :true}).then((res)=>{});
   //collection.findOneAndDelete({"_id" :new ObjectID("324sdf445")}).then((res)=>{});
  collection.remove({"complete" :true}).then((res) => {

  }).catch((err)=>{
    console.log('Unable to fetch docs');
  });

  client.close();
});
