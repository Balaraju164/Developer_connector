const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/authentication');
const User = require('../../modules/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');

//@route  Auth api/auth
//@desc    Test
//@sccess public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json('server error');
  }
});

//@route  Post user api/auth
//@desc    Authentication and get token
//@sccess public
router.post(
  '/',
  [
    check('email', 'Please provide valid email').isEmail(),
    check('password', 'please enter correct password').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //user exists
      let user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ errors: [{ msg: 'Invalid user credentials' }] });
      }

      const ismatch = await bcrypt.compare(password, user.password);

      if (!ismatch) {
        res
          .status(400)
          .json({ errors: [{ msg: 'Invalid password credentials' }] });
      }

      //return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtsecret'),
        { expiresIn: 10000 },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.json({ token });
          }
        }
      );
      //res.send('users Api');
    } catch (err) {
      console.log(err.message);
      res.status(500).json('server error');
    }
  }
);

module.exports = router;
