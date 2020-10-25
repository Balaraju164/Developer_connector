const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../Middleware/authentication');
const Profile = require('../../modules/Profile');
const User = require('../../modules/User');
const Posts = require('../../modules/Posts')
const { check, validationResult, body } = require('express-validator');
const { response } = require('express');

//@route     profile api/profile/me
//@desc      Get current user
//@access    private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avator']);

    if (!profile) {
      return res.status(400).json({ msg: 'No profile for the user id' });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).json('server error');
  }
});

//@route     Post profile Api
//@desc      Create or update profile
//@access    private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'status must be required').not().isEmpty(),
      check('skills', 'skills must be required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.toString().split(',').map((skill) => skill.trim());
    }

    //Build social project

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update data
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //creating user
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(500).json('server error');
    }

    //res.json('profile Api');
  }
);

//@route     Get profile Api
//@desc      Get all profiles
//@access    private

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avator']);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error');
  }
});

//@route     Get profile/user/:user_id
//@desc      Get profile by user id
//@access    public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avator']);
    if (!profile) {
      return res.status(500).json({ msg: 'No profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    //console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(500).json({ msg: 'Profile not found' });
    }
    res.status(500).send('server error');
  }
});

//@route     Delete profile api/profile
//@desc      Delete profile, user
//@access    private

router.delete('/', auth, async (req, res) => {
  try {
    //Delete posts
    await Posts.deleteMany({user:req.user.id})
    //delete profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //delete user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'user deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error');
  }
});

//@route     Put profile Api/experience
//@desc      Adding user experirnce
//@access    private

router.put(
  '/experience',
  [
    auth,
    [
      check('tittle', 'Tittle must be required').not().isEmpty(),
      check('company', 'company must be required').not().isEmpty(),
      check('from', 'from date must be required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        tittle,
        company,
        location,
        from,
        to,
        current,
        description,
      } = req.body;

      const newExp = {
        tittle,
        company,
        location,
        from,
        to,
        current,
        description,
      };

      try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        await profile.save();

        res.json(profile);
      } catch (error) {
        res.status(500).json('error in experience');
      }
    } catch (err) {
      res.status(500).json('Server error');
    }
  }
);

//@route     delete profile Api/experience/:experience_id
//@desc      delete user experirnce
//@access    private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //get remoaval index
    const removeindex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeindex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json('server error');
  }
});

//@route     Put profile Api/education
//@desc      Adding user education
//@access    private

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school must be required').not().isEmpty(),
      check('degree', 'degree must be required').not().isEmpty(),
      check('fieldofstudy', 'fieldofstudy date must be required')
        .not()
        .isEmpty(),
      check('from', 'from date must be required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      } = req.body;

      const newExp = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      };

      try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newExp);
        await profile.save();

        res.json(profile);
      } catch (error) {
        res.status(500).json('error in experience');
      }
    } catch (err) {
      res.status(500).json('Server error');
    }
  }
);

//@route     delete profile Api/education/:edu_id
//@desc      delete user experirnce
//@access    private

router.delete('/education/:edu', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //get remoaval index
    const removeindex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeindex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json('server error');
  }
});

//@route     GET  api/profile/github/:username
//@desc      Get user repos from github
//@access    public

router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.log(error.message);
      if (response.statusCode !== 200) {
        res.status(404).json({ msg: 'no git profile found for user' });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json('Server error');
  }
});

module.exports = router;
