const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Board = require('./board.model');

const boardAppendiceSchema = mongoose.Schema({

  board_id: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  title: { type: String, required: true },
  logo: String,
  url: String

}, {
    timestamps: true
});

module.exports = mongoose.model('Board-appendice', boardAppendiceSchema);
