
var mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const User = require('./user.model');

const userGroupSchema = mongoose.Schema({ 

    creator_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: String,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
    
}, { 
    timestamps: true 
}); 

module.exports = mongoose.model('User-group', userGroupSchema);