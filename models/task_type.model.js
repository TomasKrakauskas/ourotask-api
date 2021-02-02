
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const Board = require('./board.model');

const labelSchema = mongoose.Schema({ 

    board_id: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    icon: String,
    title: String,
    color: String
    
}, { 
    timestamps: true 
}); 

module.exports = mongoose.model('Label', labelSchema);