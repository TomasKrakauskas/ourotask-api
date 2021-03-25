const mongoose      = require('mongoose');

//functions
const passwords     = require('../functions/passwords');

//models
const User = require('../models/user.model');

//lib
const board_lib = require('./board.lib');

exports.getUser_byID = async (user_id) => {
    return new Promise(async function(resolve, reject) {
        if(!user_id) return reject(new Error('no id!'))
        else User.findById(mongoose.Types.ObjectId(user_id)).exec((e, _user) => {
            if(e) return reject(e);
            else return resolve(_user);
        });
    });
};

exports.getUser_byEmail = async (email) => {
    return new Promise(async function (resolve, reject) {
        if (!email) return reject(new Error('no id!'))
        else User.findOne({ email: email }).exec((e, _user) => {
            if (e) return reject(e);
            else return resolve(_user);
        });
    });
};

exports.changePassword = async (old, pass, email) => {
    return new Promise(async function(resolve, reject) {

        if(!email) return reject(new Error('no id!'));
        else if(!old) return reject(new Error('Previous password cannot be empty!'));
        else if(!pass) return reject(new Error('New password cannot be empty!'));
        else try { 
            
            let salt = parseInt(process.env.SALT)
            let user = await auth_lib.login(email, old);

            if(!user) return reject('Invalid email or password!');
            else User.findOne({ email: email }, { password: passwords.hashPassword(pass, salt) }).exec((e, _user) => {
                if(e) return reject(e);
                else if(_user) return resolve(_user._id);
                else return reject(new Error('Invalid ID'));
            });
        } catch(e) { return reject(e) }        
    });
}

exports.removeUser = async (user_id) => {
    return new Promise(async function (resolve, reject) {
        if (!user_id) return reject(new Error('no id!'));
        else {

            try { var user = await module.exports.getUser_byID(user_id); }
            catch (e) { return reject(e); }

            if (!user) return reject(new Error('no user!'))
            else User.findByIdAndDelete(mongoose.Types.ObjectId(user._id))
                .exec(async (e, _user) => {
                    if (e) return reject(e);
                    else if (_user) {
                        try {
                            await board_lib.deleteMany(_user._id);
                            //remove user group
                            return resolve(_user);
                        } catch(e) {
                            return reject(e);
                        }
                        
                    }
                    else return reject(new Error('Invalid ID'));
                });

        }
    });
}

