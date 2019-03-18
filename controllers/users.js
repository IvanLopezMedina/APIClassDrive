const User = require('../models/user')
// const mongoose = require('mongoose')
const service = require('../service')

const signUp = (req, res) => {
    let user = new User()
    user.email = req.body.email
    user.displayName = req.body.displayName
    user.password = req.body.password
    user.avatar = user.gravatar()

    user.save(err => {
        if (err) return res.status(500).send({ msg: `Error al crear usuario: ${err}` })
        return res.status(200).send({ user: user, token: service.createToken(user) })
    })
}

const signIn = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send({ msg: `SignIn error: ${err}` })
        if (!user) return res.status(404).send({ msg: `The user doesn't exist: ${req.body.email}` })

        return user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.status(500).send({ msg: `SignIn error: ${err}` })
            if (!isMatch) return res.status(404).send({ msg: `Password incorrect: ${req.body.email}` })

            req.user = user
            return res.status(200).send({ msg: 'Login succesfull', token: service.createToken(user) })
        })
    }).select('_id email +password')
}

const getUsers = (req, res) => {
    User.find(function (err, users) {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!users) return res.status(404).send({ message: `The user doesn't exist: ${err}` })

        res.json(users)
    })
}

const getUser = (req, res) => {
    let userId = req.params.userId

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!user) return res.status(404).send({ message: `The user doesn't exist: ${err}` })

        res.status(200).send(user)
    })
}

const updateUser = (req, res) => {
    let userId = req.params.userId
    let update = req.body

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) return res.status(500).send({ message: `Error updating product: ${err}` })

        res.status(200).send({ user: userUpdated })
    })
}

const deleteUser = (req, res) => {
    let userId = req.params.userId

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: `Error deleting the user: ${err}` })

        User.deleteOne(user, err => {
            if (err) return res.status(500).send({ message: `Error deleting the user: ${err}` })
            res.status(200).send({ message: 'The user has been deleted successfully' })
        })
    })
}

module.exports = {
    signUp,
    signIn,
    deleteUser,
    updateUser,
    getUser,
    getUsers
}
