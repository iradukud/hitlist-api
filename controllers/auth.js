const passport = require('passport');
const validator = require('validator');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

const postSignup = (req, res, next) => {
  const validationErrors = [];
  let { userName, email, password, confirmPassword } = req.body

  if (!validator.isEmail(email)) validationErrors.push({ msg: 'Please enter a valid email address' });
  if (!validator.isLength(password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (password !== confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    console.log('Error with one or more of the inputs');
    return res.status(400).json({ error: validationErrors.join('.') });
  };

  email = validator.normalizeEmail(email, { gmail_remove_dots: false });

  const user = new User({
    userName: userName,
    email: email,
    password: password
  });

  User.findOne({
    $or: [
      { email: email },
      { userName: userName }
    ]
  }, (err, existingUser) => {
    if (err) { return next(err) }
    if (existingUser) {
      console.log('Account with that email address or username already exists');
      return res.status(400).json({ error: 'Account with that email address or username already exists' });
    };
    user.save((err) => {
      if (err) { return next(err) }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        };

        const token = createToken(user['_id'])

        console.log('New user created');
        res.status(200).json({ email, token });
      });
    });
  });
};

const postLogin = (req, res, next) => {
  const validationErrors = [];
  let { email, password } = req.body

  if (!validator.isEmail(email)) {
    validationErrors.push({ msg: 'Please enter a valid email address.' });
  };

  if (validator.isEmpty(password)) {
    validationErrors.push({ msg: 'Password cannot be blank.' });
  };

  if (validationErrors.length) {
    console.log('Either the password or email is wrong!');
    return res.status(400).json({ error: validationErrors.join('. ') });
  };

  email = validator.normalizeEmail(email, { gmail_remove_dots: false });

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      console.log('Error');
      return res.status(400).json({ error: 'User not found' });
    };

    req.logIn(user, (err) => {
      if (err) { return next(err) }

      const token = createToken(user['_id'])
      const email = user['email']

      console.log('Success! You are logged in.');
      res.status(200).json({ email, token });
    });
  })(req, res, next);
};

module.exports = { postSignup, postLogin }