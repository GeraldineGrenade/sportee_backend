var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');

router.post('/user', (req, res) => {
  User.push(req.body.newUser)
  res.json({userList: User})


})

router.get('/users', (req, res)=> {
  res.json({userslist: User})
})


module.exports = router;
