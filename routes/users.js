var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET to verify if username is already present in DB
router.get('/checkUsername:username', (req, res) => {
  User.findOne({username : req.params.username})
  .then(data => data === null ? res.json({result : true}) : res.json({result : false}))
});

// Register new user in DB
// router.post('/signup', (req, res) => {
//   if (!checkBody(req.body, ['username', 'password'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }

//   // Check if the user has not already been registered
//   User.findOne({ username: req.body.username }).then(data => {
//     if (data === null) {
//       const hash = bcrypt.hashSync(req.body.password, 10);

//       const newUser = new User({
//         username: req.body.username,
//         password: hash,
//         token: uid2(32),
//         canBookmark: true,
//       });

//       newUser.save().then(newDoc => {
//         res.json({ result: true, token: newDoc.token });
//       });
//     } else {
//       // User already exists in database
//       res.json({ result: false, error: 'User already exists' });
//     }
//   });
// });


module.exports = router;
