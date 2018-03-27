const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let data = {
  id:10
};

let token = jwt.sign(data,'secret123abc');
console.log(token);

let decoded = jwt.verify(token,'secret123abc');

console.log(decoded);

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
