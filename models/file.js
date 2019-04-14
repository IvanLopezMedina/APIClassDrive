const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    groupName: {
        type: String,
        required: true
    },
    path: {
        type: String
    },
    uploadDate: {
        type: Date,
        default: Date.now()
    }
},
{
    versionKey: false
})

module.exports = mongoose.model('File', FileSchema)
