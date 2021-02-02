const mongoose      = require('mongoose');

const Task_type = require('../models/task_type.model');

exports.create = async (board_id, icon, title, color) => {
    return new Promise(async function (resolve, reject) {

        if(!board_id) return reject(new Error('No creator specified'))
        else {

            const task_type = new Task_type({
                board_id: mongoose.Schema.Types.ObjectId(board_id),
                icon: icon ? icon : '',
                title: title ? title : '',
                color: color ? color : ''
            });

            task_type.save().then(_item => {

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
            Label.Task_type(mongoose.Schema.Types.ObjectId(id)).exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.getAll = async (board_id) => {
    return new Promise(async function (resolve, reject) {

        if(!board_id) return reject(new Error('No id specified'))
        else 
            Label.find({ board_id: mongoose.Schema.Types.ObjectId(board_id)})
            .exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}

exports.update = async (id, icon, title, color) => {
    return new Promise(async function (resolve, reject) {
        if(!id) return reject(new Error('no id specified'))
        else Label.findByIdAndUpdate( mongoose.Schema.Types.ObjectId(id), {
            icon: icon ? icon : '',
            title: title ? title : '',
            color: color ? color : '',
        }, {}, (e, _item) => {
            if(e) return reject(e);
            else if(_item) return resolve({ label_id: _item._id });
            else return reject(new Error('Invalid id!'));
        });
    });
}

exports.deleteOne = async (id) => {
    return new Promise(async function (resolve, reject) {

        if(!id) return reject(new Error('No id specified'))
        else 
            Task_type.findByIdAndDelete(mongoose.Schema.Types.ObjectId(id), {}, (e, _item) => {
                if(e) return reject(e);
                else if(_item) {
                    //remove label from task
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
            Task_type.deleteMany({ board_id: mongoose.Schema.Types.ObjectId(board_id) }, {}, 
            (e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}