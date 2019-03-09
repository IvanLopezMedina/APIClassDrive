var User = require('../models/user');
var express = require('express');
var router = express.Router();

router.route('/users')

   .get(function(req, res) {
      User.find(function(err, users){

         if (err){
            return res.send(err);
         }

         res.json(users);
         
      });
   })

   .post(function(req, res){
      User.save(function(err, users){

         if (err) {
            return res.send(err);
         }

         res.send( { message: 'User added'});

      });
   });

router.route('/users/:id')
   
   .put(function(req, res){
      User.findOne( { _id: req.params.id}, function(err, user) {

         if (err){
            return res.send(err);
         }

         for (prop in req.body){
            user[prop] = req.body[prop];
         }

         user.save(function(err){
            if (err){
               return res.send(err);
            }

            res.send({ message: 'User updated'});
         });
      });
   })

   .get(function(req, res){
      User.findOne( { id: req.params.id}, function(err, user){

         if (err){
            return res.send(err);
         }

         res.json(user);
      });
   })

   .delete(function(req, res){
      User.remove({
         _id: req.params.id
      }, function (err, user){
         if (err){
            return res.send(err);
         }

         res.json( { meessage: 'User deleted'});
      });
   });

module.exports = router;