const mongoose = require('mongoose');
const profileschema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    require: true,
  },
  skills: {
    type: [String],
    require: true,
  },
  bio: {
    type: String,
  },
  githubusername: {
    type: String,
  },

  experience: [
    {
      tittle: {
        type: String,
        require: true,
      },
      company: {
        type: String,
        require: true,
      },
      loaction: {
        type: String,
      },
      from: {
        type: Date,
        require: true,
      },
      to: {
        type: Date,
        require: true,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
        require: true,
      },
      degree: {
        type: String,
        require: true,
      },
      fieldofstudy: {
        type: String,
        require: true,
      },
      from: {
        type: Date,
        require: true,
      },
      to: {
        type: Date,
        require: true,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],

  social: {
    youtube: {
      type: String,
    },
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    linkedin: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model('profile', profileschema);
