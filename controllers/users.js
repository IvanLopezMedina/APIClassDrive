const User = require('../models/user')
const service = require('../service')

const signUp = (req, res) => {
    let user = new User()
    user.name = req.body.name
    user.lastname = req.body.lastname
    user.email = req.body.email
    user.displayname = req.body.displayname
    user.password = req.body.password
    user.avatar = user.gravatar()

    user.save(err => {
        try{
            var error = err.toString().split(':')[3].split('_')[0]
        } catch {
            var error = ''
        }
        if (err) return res.status(409).send({ msg: `${error} ya existe. Utilice otro ${error}` })
        return res.status(200).send({ msg: `SignUp successful` })
    })
}

const signIn = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(409).send({ msg: `SignIn error: ${err}` })
        if (!user) return res.status(404).send({ msg: `The user doesn't exist: ${req.body.email}` })
        return user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.status(409).send({ msg: `SignIn error: ${err}` })
            if (!isMatch) return res.status(404).send({ msg: `Password incorrect: ${req.body.email}` })
            req.user = user
            return res.status(200).send({ msg: 'Login succesfull', user, token: service.createToken(user) })
        })
    }).select('name password lastname email displayname groups avatar')
}

const getUsers = (req, res) => {
    User.find(function (err, users) {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!users) return res.status(404).send({ message: `The user doesn't exist: ${err}` })

        res.status(200).send(users)
    })
}

const getUser = (req, res) => {
    let userId = req.params.userId

    User.findById(userId, (err, user) => {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!user) return res.status(404).send({ message: `The user doesn't exist: ${err}` })

        res.status(200).send(user)
    })
}

const updateUser = async function (req, res) {
    let userId = req.params.userId
    let update = req.body
    
    User.findByIdAndUpdate(userId, update.user, {new: true}, (err, userUpdated) => {
        if (err) return res.status(409).send({ message: `Error updating product: ${err}` }) 
        res.status(200).send({ user: userUpdated })
    })
}

const deleteUser = (req, res) => {
    let userId = req.params.userId

    User.findById(userId, (err, user) => {
        if (err) return res.status(409).send({ message: `Error deleting the user: ${err}` })

        User.deleteOne(user, err => {
            if (err) return res.status(409).send({ message: `Error deleting the user: ${err}` })
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
