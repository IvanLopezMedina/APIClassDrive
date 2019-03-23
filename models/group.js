const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const validator = require('validator')
const crypto = require('crypto')
const bcrypt = require('bcrypt-nodejs')

const GroupSchema = Schema({
    name: { type: String, required: true, unique: true },
    center: { type: String },
    tags: [String],
    visibility: { type: String, enum: ['public', 'private'], required: true },
    password: { type: String, select: false },
    admin: { ObjectId },
    users: [ObjectId],
    avatar: String,
    creationDate: { type: Date, default: Date.now() }
},
{
    versionKey: false
})

GroupSchema.pre('save', function (next) {
    let group = this
    if ('private'.match(group.visibility)) {
        if (this.validatePassword()) {
            if (!group.isModified('password')) return next()
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return next(err)

                bcrypt.hash(group.password, salt, null, (err, hash) => {
                    if (err) return next(err)
                    group.password = hash
                    next()
                })
            })
        } else return next({ msg: 'Password invalid' })
    } else {
        return next()
    }
})

GroupSchema.methods.gravatar = function (size) {
    if (!size) {
        size = 200
    }
    const md5 = crypto.createHash('md5').update(this.name).digest('hex')
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`
}

GroupSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch)
    })
}

GroupSchema.methods.validatePassword = function () {
    let validation = false
    if ('private'.match(this.visibility)) {
        if (this.password !== null && this.password !== undefined) validation = true
    } else {
        if (this.password === null || this.password === undefined) validation = true
    }

    return validation
}

module.exports = mongoose.model('Group', GroupSchema)
