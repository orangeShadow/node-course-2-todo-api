const mongoose = require('mongoose');

const User = mongoose.model('User',{
  name: {
    type: String,
    require: true,
    min:1,
    trim:true
  },
  email: {
    type: String,
    require: true,
    unique: true,
    min: 1,
    trim: true,
  },
  // password: {
  //   type: String,
  //   require: true,
  //   min: 1,
  //   trim: true,
  // }
})

module.exports = { User }
