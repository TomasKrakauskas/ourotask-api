const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User          = require('./user.model');
const User_group    = require('./user_group.model');

const Board     = require('./board.model');
const Task_type = require('./task_type.model');
const Label     = require('./label.model');

const taskSchema = mongoose.Schema({

    board_id: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    creator_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignee_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    status: String,
    task_type: {
        type: Schema.Types.ObjectId,
        ref: 'Task-type',
        required: true
    },
    label_ids: [{
        type: Schema.Types.ObjectId,
        ref: 'Label',
        required: true
    }],
    attachments: [String],
    
    counter: Number,
    counter_code: String,

    due_date: Date,
    completion_date: Date,

    title: { type: String, required: true },
    description: String

}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
