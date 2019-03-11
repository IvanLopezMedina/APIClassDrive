const User = require('../models/user')
const mongoose = require('mongoose')
const service = require('../service')

function signUp (req, res) {
   /*const user = new User({
      email: req.body.email,
      displayName: req.body.displayName,
      password: req.body.password
   })*/
   let user = new User()
   user.email = req.body.email
   user.displayName = req.body.displayName
   user.avatar = req.body.avatar
   user.password = req.body.password
   user.avatar = user.gravatar()

   user.save((err, userStored) => {
      if (err) res.status(500).send({ message: `Error creating the user ${err}`})

      return res.status(200).send({ user: userStored, token: service.createToken(user) })
   })
}

const signIn = (req, res) => {
   User.findOne({ email: req.body.email }, (err, user) => {
     if (err) return res.status(500).send({ msg: `Error al ingresar: ${err}` })
     if (!user) return res.status(404).send({ msg: `no existe el usuario: ${req.body.email}` })
 
     return user.comparePassword(req.body.password, (err, isMatch) => {
       if (err) return res.status(500).send({ msg: `Error al ingresar: ${err}` })
       if (!isMatch) return res.status(404).send({ msg: `Error de contraseña: ${req.body.email}` })
 
       req.user = user
       return res.status(200).send({ msg: 'Te has logueado correctamente', token: service.createToken(user) })
     });
 
   }).select('_id email +password');
 }

function getUsers (req, res) {
   User.find(function(err, users){
      if (err) return res.status(500).send( { message: `Error retrieving data: ${err}`})
      if (!users) return res.status(404).send( { message: `The user doesn't exist: ${err}`})

      res.json(users)
      
   })
}

function getUser (req, res ) {
   let userId = req.params.userId

   User.findById(userId, (err, user) => {
      if (err) return res.status(500).send( { message: `Error retrieving data: ${err}`})
      if (!user) return res.status(404).send( { message: `The user doesn't exist: ${err}`})

      res.status(200).send( { user })
   })
}

function updateUser(req, res) {
   let userId = req.params.userId
   let update = req.body

   User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
      if (err) return res.status(500).send( { message: `Error updating product: ${err}`})

      res.status(200).send({ user: userUpdated})
   })
}

function createUser (req, res) {
   let user = new User()
   user.email = req.body.email
   user.displayName = req.body.displayName
   user.avatar = req.body.avatar
   user.password = req.body.password
   
   console.log(req.body.email)
   user.save((err, userStored) => {
      if (err) return res.status(500).send( { message: `Error creating the user: ${err}`})

      res.status(200).send({user: userStored})
   })
}

function deleteUser (req, res) {
   let userId = req.params.userId

   User.findOne( userId,  (err, user) => {
      if (err) return res.status(500).send( { message: `Error deleting the user: ${err}`})

      User.remove(err => {
         if (err) return res.status(500).send( { message: `Error deleting the user: ${err}`})
         res.status(200).send( { message: 'The user has been deleted successfully'})
      })
   })
}


module.exports = {
   createUser,
   deleteUser,
   updateUser,
   getUser,
   getUsers,
   signUp,
   signIn
}