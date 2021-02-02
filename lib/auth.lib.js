const randomstring  = require('randomstring');
const mongoose      = require('mongoose');
const bcrypt        = require('bcrypt');

//function
const passwords     = require('../functions/passwords');
const dates         = require('../functions/dates');
const validator     = require('../functions/validator')

//models
const User = require('../models/user.model');

//libs
const user_lib      = require('./users.lib');

exports.register = async (alias, email, password) => {
    return new Promise(async function (resolve, reject) {
       
        let temp = email.toLowerCase().replace(/\s/g,'');
        let reformed_email, salt;
        
        try { 
            salt = parseInt(process.env.SALT)
            reformed_email = await validator.validate_email(temp); 
        }
        catch(e) { return reject(e); }

        const user = new User({

            alias: alias,
            email: reformed_email,
            password: passwords.hashPassword(password, salt),

            reset_token: null,
            reset_expiration: null,
        });

        user.save().then(async _user => {
            if(_user) 
                return resolve({
                    user: {
                        owner_id: _user.owner_id ? _user.owner_id : null,
                        branch_id: _user.branch_id ? _user.branch_id : null,

                        alias: _user.alias ? _user.alias : '',
                        email: _user.email ? _user.email : '',
                    },
                });
            else 
                return reject(new Error('Invalid id!'));
        }).catch(e => {
            return reject(e)
        });


    });

}
exports.login = async (email, password) => {
    return new Promise(async function(resolve, reject) {
        
        if(!email) return reject(new Error('email cannot be empty'));

        try { var user = await user_lib.getUser_byEmail(email); }
        catch(e) { return reject(e); }


        if(!user) return resolve();
        else if(bcrypt.compareSync(password, user.password)) return resolve(user);
        else return resolve();

    });
}

//update password
exports.resetPassword = async (reset, email, pass) => {
    return new Promise(async function(resolve, reject) {

        try { var user = await users.getUser_byEmail(email); }
        catch(e) { return reject(e); }

        if(!user) return reject(new Error('no such user!'));
        else if(!user.reset_token || !user.reset_expiration) return reject(new Error('no reset request'));
        else if(user.reset_token != reset) return reject(new Error('reset does not match!'));
        else if(dates.isAfter(user.reset_expiration, new Date())) return reject(new Error('reset has expired!'));
        else {

            try { salt = parseInt(process.env.SALT) }
            catch(e) { return reject(e) }

            User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id), {
                password: passwords.hashPassword(pass, salt),
                reset_token: null,
                reset_expiration: null
            }).exec((e, _user) => {
                if(e) return reject(e);
                else if(_user) return resolve(_user._id);
                else return reject(new Error('Invalid id!'));
            });

        }

    });
};
exports.requestPasswordReset = async (email) => {
    return new Promise(async function(resolve, reject) {

        try { var user = await users.getUser_byEmail(email); }
        catch(e) { return reject(e); }

        if(!user) return reject(new Error('no such user!'));
        else {

            let temp_date = new Date().setHours(new Date().getHours() + 2)

            User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id), {
                reset_token: randomstring.generate(),
                reset_expiration: new Date(new Date().setHours(new Date(temp_date).getHours()+2)),
            }).exec((e, _user) => {
                if(e) return reject(e);
                else if(_user) return resolve(_user._id);
                else return reject(new Error('Invalid id!'));
            });

        }

    });
};