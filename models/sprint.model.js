
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const Board = require('./board.model');

const sprintSchema = mongoose.Schema({ 

    board_id: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    frozen: Boolean,
    backlog: Boolean,
    title: String,
    due_date: Date,
    completion_date: Date
    
}, { 
    timestamps: true 
}); 

module.exports = mongoose.model('Sprint', sprintSchema);