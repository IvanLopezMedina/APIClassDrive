var mongoose = require('mongoose')
var Schema=mongoose.Schema

var universitySchema = new Schema ({
   name: String,
   country: String
})


module.exports = mongoose.model('University', universitySchema)