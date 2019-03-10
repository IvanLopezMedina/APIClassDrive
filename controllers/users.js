const User = require('../models/user')

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
   getUsers
}