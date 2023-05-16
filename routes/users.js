var express = require('express');
var router = express.Router();


require('../models/connection');
const User = require('../models/users');

//test route post 
// router.post('/', (req, res) => {
//   // User.push(req.body.newUser)
//   res.json({ userList: User })

// })

//test route get
router.get('/', (req, res) => {
  res.json({ usersList: User })
});


// GET to verify if username is already present in DB
router.get('/checkUsername/:username', (req, res) => {
  User.findOne({ username: req.params.username })
    .then(data => {
      console.log('data in back ---', data)
      data === null ? res.json({ result: true }) : res.json({ result: false })
    })
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

router.post('/', async (req, res) => {
  try {
    const { family_name, given_name, email } = req.body.userInfo

    const user = new User({
      lastname: family_name,
      firstname: given_name,
      email: email,
      username: given_name
    })

    await user.save()

    res.json({ message: 'Les informations utilisateur ont été enregistrées avec succès !' })
  } catch (error) {
    res.json({ error: 'error' })
  }
})


module.exports = router;
