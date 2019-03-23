const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        match: /\S+@\S+\.\S+/
    },
    displayname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        select: false,
        minlength: 8,
        required: true
    },
    country: {
        type: String,
        select: true,
        required: true
    },
    avatar: String,
    signupDate: {
        type: Date,
        default: Date.now()
    },
    lastLogin: Date
},
{
    versionKey: false
})

UserSchema.pre('save', function (next) {
    let user = this
    if (!user.isModified('password')) return next()

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err)

            user.password = hash
            next()
        })
    })
})

UserSchema.methods.gravatar = function (size) {
    if (!size) {
        size = 200
    }
    if (!this.email) return `https:/gravatar.com/avatar/?s${size}&d=retro`
    const md5 = crypto.createHash('md5').update(this.email).digest('hex')
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`
}

UserSchema.methods.comparePassword = function (candidatePassword, onPasswordCompared) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        onPasswordCompared(err, isMatch)
    })
}

module.exports = mongoose.model('User', UserSchema)
