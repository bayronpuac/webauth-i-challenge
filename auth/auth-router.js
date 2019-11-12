const bcrypt = require('bcryptjs');

const router = require('express').Router();

const Users = require('../users/users-model');

const reqauth = require('../auth/requires-auth-middleware')

router.post('/register',  (req, res) => {
    let UserInformation = req.body;

    bcrypt.hash(UserInformation.password, 12, (err, hashedPassword)=> {
        UserInformation.password = hashedPassword;
        
        Users.add(UserInformation)
        .then(saved => {
          req.session.username = saved.username; 
          res.status(201).json(saved);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        // check that the password is valid
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.username = user.username; 
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

  router.get("/logout", (req, res) => {
    console.log(req.session);
    if (req.session) {
      req.session.destroy(error => {
        if (error) {
          res
            .status(500)
            .json({
              message:
                "you can check out any time you like, but you can never leave..."
            });
        } else {
          res.status(200).json({ message: "logged out successfully" });
        }
      });
    } else {
      res.status(200).json({ message: "by felicia" });
    }
  });

module.exports = router;