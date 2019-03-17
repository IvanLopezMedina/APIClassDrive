const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

const UserSchema = new Schema({
    _id: { type: String, lowercase: true },
    Name: { type: String, lowercase: true },
    Surname: { type: String, lowercase: true },
    Email: { type: String, lowercase: true },
    Password: { type: String, select: true },
    Country: { type: String, select: true },
    Avatar: String,
    SignupDate: { type: Date, default: Date.now },
    LastLogin: Date
},
{
    versionKey: false
})

UserSchema.pre('save', function (next) {
    let user = this
    if (!user.isModified('Password')) return next()

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)

        bcrypt.hash(user.Password, salt, null, (err, hash) => {
            if (err) return next(err)

            user.Password = hash
            next()
        })
    })
})

UserSchema.methods.gravatar = function (size) {
    if (!size) {
        size = 200
    }
    if (!this.Email) return `https:/gravatar.com/avatar/?s${size}&d=retro`
    const md5 = crypto.createHash('md5').update(this.Email).digest('hex')
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`
}

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.Password, (err, isMatch) => {
        cb(err, isMatch)
    })
}

module.exports = mongoose.model('User', UserSchema)
