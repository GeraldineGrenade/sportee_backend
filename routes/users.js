var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

require('../models/connection');
const User = require('../models/users');

router.post('/user', (req, res) => {
  User.push(req.body.newUser)
  res.json({userList: User})


})

router.get('/users', (req, res)=> {
  res.json({usersList: User})
});




/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
