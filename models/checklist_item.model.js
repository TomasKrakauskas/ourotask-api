
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const Task_type = require('./task_type.model');
const Checklist_item = require('./checklist.model');

const checkListItemSchema = mongoose.Schema({ 

    task_type: {
        type: Schema.Types.ObjectId,
        ref: 'Task-type',
        required: true
    },
    checklist_id: {
        type: Schema.Types.ObjectId,
        ref: 'Checklist',
        required: true
    },
    title: String,
    
}, { 
    timestamps: true 
}); 

module.exports = mongoose.model('Checklist-item', checkListItemSchema);