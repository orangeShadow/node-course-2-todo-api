const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password='123abc!';


// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

let hashedPassword = '$2a$10$oYJkeFoxuxq6Fz3ah60IWOMMhXfJMpeuCwv9DkIGQnv09cjUcbL0.'

bcrypt.compare('123', hashedPassword, (err,res)=>{
  console.log(res);
});

// let data = {
//   id:10
// };

// let token = jwt.sign(data,'secret123abc');
// console.log(token);

// let decoded = jwt.verify(token,'secret123abc');

// console.log(decoded);

// let message = "I am user number 3";
// let hash = SHA256(message).toString();

// console.log(`Message ${message}`);
// console.log(`Hash ${hash}`);

// var data = {
//   id: 4
// };

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data)+'somesecret').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();

// if(resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust');
// }
