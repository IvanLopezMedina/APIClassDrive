const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupSchema = Schema({
    name: String,
    picture: String,
    description: String,
    category: { type: String, enum: ['public', 'private'] },
    password: { type: String, select: false }
},
{
    versionKey: false
})

module.exports = mongoose.model('Group', GroupSchema)
