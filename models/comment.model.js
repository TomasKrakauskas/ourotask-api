
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const Task = require('./task.model');
const User = require('./user.model');

const commentSchema = mongoose.Schema({ 

    task_id: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    creator_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reply: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },

    content: { 
        type: String, 
        required: true 
    }
    
}, { 
    timestamps: true 
}); 

module.exports = mongoose.model('Comment', commentSchema);