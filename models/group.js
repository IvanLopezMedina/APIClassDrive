const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const GroupSchema = Schema({
    name: String,
    center: String,
    degreee: String,
    tags: [String],
    type: { type: String, enum: ['public', 'private'] },
    picture: String,
    user_admin: ObjectId,
    users: [ObjectId],
    password: { type: String, select: false }
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
module.exports = mongoose.model('Group', GroupSchema)
