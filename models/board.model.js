const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User          = require('./user.model');
const User_group    = require('./user_group.model');

const boardSchema = mongoose.Schema({

  creator_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user_group_id: {
    type: Schema.Types.ObjectId,
    ref: 'User_group'
  },


  favorite: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,


  counter_appendice: String,
  counter: {
    type: Number,
    required: true
  },


  logo_url: String,
  background_url: String


}, {
    timestamps: true
});

module.exports = mongoose.model('Board', boardSchema);
