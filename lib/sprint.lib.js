const mongoose      = require('mongoose');

//models
const Sprint = require('../models/sprint.model');

//lib
const task_lib              = require('./task.lib');


exports.create = async (board_id, title, due_date) => {
    return new Promise(async function (resolve, reject) {

        if(!board_id) return reject(new Error('No creator specified'))
        else try {

            let sprint = new Sprint({
                board_id: mongoose.Schema.Types.ObjectId(board_id),
                freeze: false,
                backlog: false,
                title: title ? title : '',
                due_date: due_date ? due_date : '',
                completion_date: null,
            })

            sprint.save().then(_item => {

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
exports.createBacklog = async (board_id, title) => {
    return new Promise(async function (resolve, reject) {

        if(!board_id) return reject(new Error('No creator specified'))
        else try {

            let sprint = new Sprint({
                board_id: mongoose.Schema.Types.ObjectId(board_id),
                freeze: false,
                backlog: true,
                title: title ? title : 'Backlog',
                due_date: null,
                completion_date: null,
            });

            sprint.save().then(_item => {

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
        Sprint.findById(mongoose.Schema.Types.ObjectId(id)).exec((e, _item) => {
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
        Sprint.find({ board_id: mongoose.Schema.Types.ObjectId(board_id)})
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
        else Sprint.findByIdAndUpdate( mongoose.Schema.Types.ObjectId(id), {
            title: title ? title: '',
        }, {}, (e, _item) => {
            if(e) return reject(e);
            else if(_item) return resolve({ sprint_id: _item._id });
            else return reject(new Error('Invalid id!'));
        });
    });
}

exports.complete = async (id) => {
    return new Promise(async function (resolve, reject) {
        if(!id) return reject(new Error('no id specified'))
        else Sprint.findByIdAndUpdate( mongoose.Schema.Types.ObjectId(id), {
            frozen: true,
            completion_date: new Date()
        }, {}, (e, _item) => {
            if(e) return reject(e);
            else if(_item) return resolve({ sprint_id: _item._id });
            else return reject(new Error('Invalid id!'));
        });
    });
}

exports.deleteOne = async (id) => {
    return new Promise(async function (resolve, reject) {

        if(!id) return reject(new Error('No id specified'))
        else 
            Sprint.findOneAndDelete({ _id: mongoose.Schema.Types.ObjectId(id), backlog: false }, {}, 
            async (e, _item) => {
                if(e) return reject(e);
                else if(_item) {
                    try {
                        await task_lib.deleteMany(_item._id);
                        return resolve(_item);
                    } catch(e) {
                        return reject(e)
                    }
                }
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.deleteMany = async (board_id) => {
    return new Promise(async function (resolve, reject) {

        if(!board_id) return reject(new Error('No id specified'))
        else 
            Sprint.deleteMany({ board_id: mongoose.Schema.Types.ObjectId(board_id) }, {}, 
            async (e, _item) => {
                if(e) return reject(e);
                else if(_item) {
                    try {
                        await _item.map(async (_it) => await task_lib.deleteMany(_it._id))
                        return resolve(_item);
                    } catch(e) {
                        return reject(e)
                    }  
                }
                else return reject(new Error('Invalid id'))
            });
    });
}