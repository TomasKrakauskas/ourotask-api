const mongoose      = require('mongoose');

//models
const Checklist_item = require('../models/checklist_item.model');

//lib

exports.create = async (task_type, checklist_id, title) => {
    return new Promise(async function (resolve, reject) {

        if(!board_id) return reject(new Error('No creator specified'))
        else try {

            const checklist_item = new Checklist_item({
                task_type: mongoose.Types.ObjectId(task_type),
                checklist_id: mongoose.Types.ObjectId(checklist_id),
                status: 'TO DO',
                title: title ? title : '',
            });

            checklist_item.save().then(_item => {

                if(_item) 
                    return resolve(_item); 
                else 
                    return reject(new Error('Error during creation'));

            }).catch(e => {
                return resolve(e);
            });

        } catch(e) {
            return reject(e);
        }

        
    });
}

exports.getOne = async (id) => {
    return new Promise(async function (resolve, reject) {

        if(!id) return reject(new Error('No id specified'))
        else 
            Checklist_item.findById(mongoose.Types.ObjectId(id)).exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.getAll = async (checklist_id) => {
    return new Promise(async function (resolve, reject) {

        if(!checklist_id) return reject(new Error('No id specified'))
        else 
            Checklist_item.find({ checklist_id: mongoose.Types.ObjectId(checklist_id)})
            .exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}

exports.update = async (id, task_type, status, title) => {
    return new Promise(async function (resolve, reject) {
        if(!id) return reject(new Error('no id specified'))
        else Checklist_item.findByIdAndUpdate( mongoose.Types.ObjectId(id), {
            task_type: mongoose.Types.ObjectId(task_type),
            title: title ? title: '',
            status: status ? status : 'TO DO',
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
            Checklist_item.findByIdAndDelete(mongoose.Types.ObjectId(id), {}, (e, _item) => {
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
            Checklist_item.deleteMany({ board_id: mongoose.Types.ObjectId(board_id) }, {}, 
            (e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}