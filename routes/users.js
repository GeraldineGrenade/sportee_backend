var express = require('express');
var router = express.Router();
const uid2 = require('uid2');

const User = require('../models/users');

// GET to verify if username is already present in DB
router.get('/checkUsername/:username', (req, res) => {
  User.findOne({ username: req.params.username })
    .then(data => {
      data === null ? res.json({ result: true }) : res.json({ result: false })
    })
});

// GET to verify if email is already present in DB
router.get('/checkEmail/:email', (req, res) => {
  User.findOne({ email: req.params.email })
    .then(data => {
      data === null ? res.json({ result: true }) : res.json({ result: false })
    })
});


//{"avatar": "https://res.cloudinary.com/dsd7uux0v/image/upload/v1684405796/sportee/avatar1_suh7vc.png", "dateOfBirth": "", "email": "geraldine.grenade@gmail.com", "firstname": "Géraldine", "lastname": "Grenade", "password": "Gg_06.04#", "telephone": "", "userPreferences": {"habits": ["Le midi en semaine"], "level": "Débutant", "sports": ["6463911a0efb12e60cbd26a7", "646391e10efb12e60cbd26ac"]}, "username": "GG"}

//Signup route - register new user in DB
router.post('/signup', (req, res) => {
  try {

    const { avatar, dateOfBirth, email, firstname, lastname, password, phone, preferences, username } = req.body
    const newUser = new User({
      lastname,
      firstname,
      email,
      password: bcrypt.hashSync(password, 10),
      phone,
      username,
      avatar,
      token: uid2(32),
      preferences: preferences,
      badges: []
    });

    newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    

  } catch(e) {
    res.json({result: false, error: e})
  }
});

//Sign in ou up with google/facebook 
router.post('/social', async (req, res) => {
  try {
    const { family_name, given_name, email } = req.body.userInfo

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.json({ message: 'L\'utilisateur existe déjà !' })
    }

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
