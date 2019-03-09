var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var usersSchema = new Schema ({
   mail: String,
   password: String
});


module.exports = mongoose.model('User', usersSchema)