const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const validator = require('validator')

const GroupSchema = Schema({
    name: { type: String, required: true, unique: true },
    center: { type: String },
    tags: [String],
    visibility: { type: String, enum: ['public', 'private'], required: true },
    password: { type: String, select: false },
    admin: { ObjectId, required: true },
    users: [ObjectId],
    avatar: String,
    creationDate: { type: Date, default: Date.now() }
},
{
    versionKey: false
})

GroupSchema.methods.gravatar = function (size) {
    if (!size) {
        size = 200
    }
    const md5 = crypto.createHash('md5').update(this.name).digest('hex')
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`
}

GroupSchema.methods.validatePassword = function () {
    let validation = false
    if ('private'.match(this.visibility)) {
        if (validator.isLength(this.password, 8)) validation = true
    } else {
        validation = true
    }
    return validation
}

module.exports = mongoose.model('Group', GroupSchema)
