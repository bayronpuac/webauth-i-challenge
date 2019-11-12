const bcrypt = require('bcryptjs');
const router = require('express').Router();

const authRoute = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

router.use('/auth', authRoute);
router.use('/users', usersRouter);

router.get('/', (req, res) => {
    res.json({ api: "It's alive" });
  });

router.post('/hash', (req, res) => {
    // read a password from the body
    const password = req.body.password;
  
    // hash the password using bcryptjs
    const hash = bcrypt.hashSync(password, 12);
  
    // return it to the user in an object that looks like
    // { password: 'original passsword', hash: 'hashed password' }
    res.status(200).json({ password, hash });
});
  

module.exports = router;
