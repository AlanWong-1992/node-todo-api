const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(15, (err, salt) => {
// 	bcrypt.hash(password, salt, (err, hash) => {
// 		console.log(hash);
// 	});
// });

var hashedPassword = '$2a$10$yBl0WRcdcm8dEaaemQ.Rmurec6.R5mahfqInBDHiv2CrRKc/538Oy';
var hashedPassword2 = '$2a$15$0UZtxj1I4jHU29YIvUjnf.QLruhH/jCeXbeP7eztc5P0iEDh0Lj0C';

bcrypt.compare(password, hashedPassword2, (err, res) => {
	console.log(res); 
})

// var data = {
// 	id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log('decoded:', decoded);



