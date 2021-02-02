
var mongoose = require('mongoose'); 

const userSchema = mongoose.Schema({ 

    alias: { 
        type: String, 
        required: true 
    }, 
    email: { 
        type: String, 
        required: true, 
        unique: true 
    }, 
    password: { 
        type: String, 
        required: true 
    }, 
    reset_token: String,
    reset_expiration: Date 
    
}, { 
    timestamps: true 
}); 

module.exports = mongoose.model('User', userSchema);