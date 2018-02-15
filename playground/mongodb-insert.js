const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');
  var db = client.db('TodoApp');

  const collection  = db.collection('Users');

  collection.find({"name" : {"$regex":/Anton .*?/}}).count().then((count) => {
    console.log('Todos:',count);
    //console.log(JSON.stringify(docs, undefined,2));
  }).catch((err)=>{
    console.log('Unable to fetch docs');
  });

  client.close();
});
