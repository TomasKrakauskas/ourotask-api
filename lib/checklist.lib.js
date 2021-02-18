const mongoose      = require('mongoose');

//models
const Checklist = require('../models/checklist.model');

//lib
const task_lib = require('./task.lib');

exports.create = async (task_id, title) => {
    return new Promise(async function (resolve, reject) {

        if(!board_id) return reject(new Error('No creator specified'))
        else try {

            let [counter, task ] = await Promise.all([
                task_lib.incrementCounter(task_id),
                task_lib.getOne(task_id)
            ]);
            if(counter == null || !task) return reject(new Error('Invalid task id or counter')) 
            let task_counter = task.counter_code + '_' + counter; 
            

            const checklist = new Checklist({
                task_id: mongoose.Schema.Types.ObjectId(task_id),
                title: title ? title : '',
                counter_code: task_counter
            });

            checklist.save().then(_item => {

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
            Checklist.findById(mongoose.Schema.Types.ObjectId(id)).exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.getAll = async (task_id) => {
    return new Promise(async function (resolve, reject) {

        if(!task_id) return reject(new Error('No id specified'))
        else 
            Checklist.find({ task_id: mongoose.Schema.Types.ObjectId(task_id)})
            .exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}

exports.update = async (id, task_type, title) => {
    return new Promise(async function (resolve, reject) {
        if(!id) return reject(new Error('no id specified'))
        else Checklist.findByIdAndUpdate( mongoose.Schema.Types.ObjectId(id), {
            task_type: mongoose.Schema.Types.ObjectId(task_type),
            title: title ? title: '',
        }, {}, (e, _item) => {
            if(e) return reject(e);
            else if(_item) return resolve({ checklist_id: _item._id });
            else return reject(new Error('Invalid id!'));
        });
    });
}

exports.deleteOne = async (id) => {
    return new Promise(async function (resolve, reject) {

        if(!id) return reject(new Error('No id specified'))
        else 
            Checklist.findByIdAndDelete(mongoose.Schema.Types.ObjectId(id), {}, (e, _item) => {
                if(e) return reject(e);
                else if(_item) {
                    return resolve(_item);
                }
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.deleteMany = async (task_id) => {
    return new Promise(async function (resolve, reject) {

        if(!task_id) return reject(new Error('No id specified'))
        else 
            Checklist.deleteMany({ task_id: mongoose.Schema.Types.ObjectId(task_id) }, {}, 
            (e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}