
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const Task = require('./task.model');
const task_type = require('./task_type.model');

const checkListSchema = mongoose.Schema({ 

    task_type: {
        type: Schema.Types.ObjectId,
        ref: 'Task-type',
        required: true
    },
    task_id: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    status: String,
    title: String,
    counter_code: String
    
}, { 
    timestamps: true 
}); 

module.exports = mongoose.model('Checklist-item', checkListSchema);