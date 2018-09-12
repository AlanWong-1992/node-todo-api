const mongoose = require('mongoose');

const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000
};

mongoose.Promise = global.Promise;
MONGODB_URI = 'mongodb://heroku_r8zqbvrc:cgrrnae7r7k5ng27me2cb7cb1m@ds141952.mlab.com:41952/heroku_r8zqbvrc'
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};