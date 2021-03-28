const mongoose      = require('mongoose');

const User_group = require('../models/user_group.model');

exports.create = async (creator_id, title) => {
    return new Promise(async function (resolve, reject) {

        if(!creator_id) return reject(new Error('No creator specified'))
        else {

            const user_group = new User_group({
                creator_id: mongoose.Types.ObjectId(creator_id),
                title: title ? title : '',
            });

            user_group.save().then(_item => {

                if(_item) 
                    return resolve(_item); 
                else 
                    return reject(new Error('Error during creation'));

            }).catch(e => {
                return resolve(e);
            });

        }
    });
}

exports.getOne = async (id) => {
    return new Promise(async function (resolve, reject) {

        if(!id) return reject(new Error('No id specified'))
        else 
            User_group.findById(mongoose.Types.ObjectId(id)).exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.getAll = async (creator_id) => {
    return new Promise(async function (resolve, reject) {

        if(!creator_id) return reject(new Error('No creator id specified'))
        else 
            User_group.find({ creator_id: mongoose.Types.ObjectId(creator_id)})
            .exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}

exports.update = async (id, title) => {
    return new Promise(async function (resolve, reject) {
        if(!id) return reject(new Error('no id specified'))
        else User_group.findByIdAndUpdate( mongoose.Types.ObjectId(id), {
            title: title ? title: '',
        }, {}, (e, _item) => {
            if(e) return reject(e);
            else if(_item) return resolve({ user_group_id: _item._id });
            else return reject(new Error('Invalid id!'));
        });
    });
}
//array updates
exports.addUser = async (id, user_id) => {
    return new Promise(async function (resolve, reject) {
        if(!id) return reject(new Error('no id specified'))
        else User_group.findByIdAndUpdate( mongoose.Types.ObjectId(id), {
            $push: {
                users: mongoose.Types.ObjectId(user_id)
            }
        }, {}, (e, _item) => {
            if(e) return reject(e);
            else if(_item) return resolve({ user_group_id: _item._id });
            else return reject(new Error('Invalid id!'));
        });
    });
}
exports.removeUser = async (id, user_id) => {
    return new Promise(async function (resolve, reject) {
        if(!id) return reject(new Error('no id specified'))
        else User_group.findByIdAndUpdate( mongoose.Types.ObjectId(id), {
            $pull: {
                users: mongoose.Types.ObjectId(user_id)
            }
        }, {}, (e, _item) => {
            if(e) return reject(e);
            else if(_item) return resolve({ user_group_id: _item._id });
            else return reject(new Error('Invalid id!'));
        });
    });
}

exports.deleteOne = async (id) => {
    return new Promise(async function (resolve, reject) {

        if(!id) return reject(new Error('No id specified'))
        else 
            User_group.findByIdAndDelete(mongoose.Types.ObjectId(id), {}, (e, _item) => {
                if(e) return reject(e);
                else if(_item) { 
                    //remove assignee's
                    return resolve(_item); 
                }
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.deleteMany = async (board_id) => {
    return new Promise(async function (resolve, reject) {

        if(!board_id) return reject(new Error('No id specified'))
        else 
            User_group.deleteMany({ board_id: mongoose.Types.ObjectId(board_id) }, {}, 
            (e, _item) => {
                if(e) return reject(e);
                else if(_item) {
                    //remove assignee's
                    return resolve(_item);
                }
                else return reject(new Error('Invalid id'))
            });
    });
}