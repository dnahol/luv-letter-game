'use strict';

var express = require('express');
var router = express.Router();

var User = require('../models/user');

//shouldn't have a get all users in final
//only for developing
router.get('/', (req, res) => {
  console.log('get users hit')
  User.find({}, (err, users) => {
    res.status(err ? 400 : 200).send(err || users);
  });
});

//   /api/users/register
router.post('/register', (req, res) => {
  console.log('register hit')
  User.register(req.body, err => {
    res.status(err ? 400 : 200).send(err);
  });
});

router.post('/login', (req, res) => {
  console.log('login hit')
  User.authenticate(req.body, (err, token) => {
    if(err) return res.status(400).send(err);

    res.cookie('accessToken', token).send(token);
  });
});

router.delete('/logout', (req, res) => {
  console.log('logout hit')
  res.clearCookie('accessToken').send();
});

// /api/users/profile
router.get('/profile', User.isLoggedIn, (req, res) => {
  console.log('req.user:', req.user);
  res.send(req.user);
})

module.exports = router;
