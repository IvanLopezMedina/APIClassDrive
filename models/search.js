const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SearchSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    nSearches: {
        type: Number,
        required: true
    }
},
{
    versionKey: false
})

module.exports = mongoose.model('Search', SearchSchema)
