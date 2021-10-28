const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default:"Жак-Ив Кусто"
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default:"Исследователь"
  },

  avatar: {
    type: String,
    default:"https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png"
  },

  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: "неправильный формат e-mail"
    }
  },

  password: {
    type: String,
    required: true,
  },
})

userSchema.statics.findUserByCredentials = (email, passoword) => {
  return this.findOne({email})
  .then((user) => {
    if(!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }

    return bcrypt.compare(passoword, user.password)
    .then((matched) => {
      if(!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return user
    })
  })

}

module.exports = mongoose.model('user', userSchema)