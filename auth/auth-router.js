const bcrypt = require('bcryptjs');

const router = require('express').Router();

const Users = require('../users/users-model');

const reqauth = require('../auth/requires-auth-middleware')

router.post('/register',  (req, res) => {
    let UserInformation = req.header;

    bcrypt.hash(UserInformation.password, 12, (err, hashedPassword)=> {
        UserInformation.password = hashedPassword;
        
        Users.add(UserInformation)
        .then(saved => {
          res.status(201).json(saved);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    });
});

router.post('/login',reqauth, (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        // check that the password is valid
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'You shall not pass!' });
        }
      })
      .catch(error => {
        console.log('login error', error);
        res.status(500).json(error);
      });
  });


module.exports = router;