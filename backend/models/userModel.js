const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const validMailsProvider = require('../utils/validMailsProvider');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
}, { timestamps: true });

// static methods

userSchema.statics.signup = async function (email, password) {

  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  if (!validator.isEmail(email) || !validMailsProvider.includes(email.match(/(?<=@)[^.]+(?=\.)/)[0])) {
    throw new Error('Email is invalid');
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error('Password not strong enough');
  }
  const exists = await this.findOne({ email });
  if (exists) {
    throw new Error('Email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await this.create({
    email,
    password: passwordHash
  });

  return user;
}

userSchema.statics.login = async function (email, password) {

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Incorrect email or password');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error('Incorrect email or password');
  }

  return user;
}

module.exports = mongoose.model('User', userSchema);
