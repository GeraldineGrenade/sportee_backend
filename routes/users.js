var express = require('express');
var router = express.Router();


require('../models/connection');
const User = require('../models/users');

router.post('/', (req, res) => {
  // User.push(req.body.newUser)
  res.json({userList: User})


})

router.get('/', (req, res)=> {
  res.json({usersList: User})
});






module.exports = router;
