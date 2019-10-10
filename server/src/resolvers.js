const mongoose = require('mongoose');
const authenticateGoogle = require('./passport');

const User = mongoose.model('User');

module.exports = {
  Mutation: {
    // insert authGoogle mutation here
  }
};