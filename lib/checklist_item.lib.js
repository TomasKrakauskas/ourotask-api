const mongoose      = require('mongoose');

//models
const Checklist_item = require('../models/checklist_item.model');

//lib
const task_lib = require('./task.lib');

exports.create = async (task_type, task_id, title) => {
    return new Promise(async function (resolve, reject) {

        if(!board_id) return reject(new Error('No creator specified'))
        else try {

            let [counter, task ] = await Promise.all([
                task_lib.incrementCounter(task_id),
                task_lib.getOne(task_id)
            ]);
            if(counter == null || !task) return reject(new Error('Invalid task id or counter')) 
            let task_counter = task.counter_code + '_' + counter; 
            

            const checklist_item = new Checklist_item({
                task_type: mongoose.Schema.Types.ObjectId(task_type),
                task_id: mongoose.Schema.Types.ObjectId(task_id),
                status: 'TO DO',
                title: title ? title : '',
                counter_code: task_counter
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
            Checklist_item.findById(mongoose.Schema.Types.ObjectId(id)).exec((e, _item) => {
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
            Checklist_item.find({ board_id: mongoose.Schema.Types.ObjectId(board_id)})
            .exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}

exports.update = async (id, task_id, status, title) => {
    return new Promise(async function (resolve, reject) {
        if(!id) return reject(new Error('no id specified'))
        else Checklist_item.findByIdAndUpdate( mongoose.Schema.Types.ObjectId(id), {
            task_id: mongoose.Schema.Types.ObjectId(task_id),
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
            Checklist_item.findByIdAndDelete(mongoose.Schema.Types.ObjectId(id), {}, (e, _item) => {
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
            Checklist_item.deleteMany({ board_id: mongoose.Schema.Types.ObjectId(board_id) }, {}, 
            (e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}