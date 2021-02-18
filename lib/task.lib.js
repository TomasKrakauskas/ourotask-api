const mongoose      = require('mongoose');
const { create } = require('../models/task.model');

//models
const Task = require('../models/task.model');

//lib
const sprint_lib = require('./sprint.lib');

exports.create = async (sprint_id, creator_id, task_type, title, description, due_date) => {
    return new Promise(async function (resolve, reject) {

        if(!sprint_id) return reject(new Error('No board specified'))
        if(!creator_id) return reject(new Error('No creator specified'))
        if(!task_type) return reject(new Error('No task specified'))
        else {

            let board = await sprint_lib.getOne(sprint_id);
            if(!board) return reject(new Error('Invalid board id'));

            counter_code = board.counter_appendice + '-';
            counter_code += await sprint_lib.incrementCounter(board._id);

            const task = new Task({
                sprint_id: mongoose.Schema.Types.ObjectId(sprint_id),
                creator_id: mongoose.Schema.Types.ObjectId(creator_id),
                assignee_id: null,
                status: 'TO DO',
                task_type: mongoose.Schema.Types.ObjectId(task_type),
                label_ids: [],
                attachments: [],
                counter: 0,
                counter_code: counter_code ? counter_code : '',
                due_date: due_date ? due_date : null,
                completion_date: null,
                title: title ? title : '',
                description: description ? description : '',
            });

            task.save().then(_item => {

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
            Task.findById(mongoose.Schema.Types.ObjectId(id)).exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.getAllBoard = async (sprint_id) => {
    return new Promise(async function (resolve, reject) {

        if(!sprint_id) return reject(new Error('No board id specified'))
        else 
            Task.find({ sprint_id: mongoose.Schema.Types.ObjectId(sprint_id)})
            .exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.getAllType = async (sprint_id, task_type) => {
    return new Promise(async function (resolve, reject) {

        if(!sprint_id) return reject(new Error('No board id specified'))
        else if(!task_type) return reject(new Error('No status type id specified'))
        else 
            Task.find({ 
                sprint_id: mongoose.Schema.Types.ObjectId(sprint_id),
                task_type: mongoose.Schema.Types.ObjectId(task_type)
            }).exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.getAllAssignee = async (sprint_id, assignee_id) => {
    return new Promise(async function (resolve, reject) {

        if(!sprint_id) return reject(new Error('No board id specified'))
        else if(!assignee_id) return reject(new Error('No assignee id specified'))
        else 
            Task.find({ 
                sprint_id: mongoose.Schema.Types.ObjectId(sprint_id),
                assignee_id: mongoose.Schema.Types.ObjectId(assignee_id)
            }).exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.getAllStatus = async (sprint_id, status) => {
    return new Promise(async function (resolve, reject) {

        if(!sprint_id) return reject(new Error('No id specified'))
        else if(!status) return reject(new Error('No status specified'))
        else 
            Task.find({ 
                sprint_id: mongoose.Schema.Types.ObjectId(sprint_id),
                status: status
            }).exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.getAllCreator = async (sprint_id, creator_id) => {
    return new Promise(async function (resolve, reject) {

        if(!sprint_id) return reject(new Error('No board id specified'))
        else if(!creator_id) return reject(new Error('No creator id specified'))
        else 
            Task.find({ 
                sprint_id: mongoose.Schema.Types.ObjectId(sprint_id),
                creator_id: mongoose.Schema.Types.ObjectId(creator_id)
            }).exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}

exports.update = async (id, task_type, title, description, status, due_date) => {
    return new Promise(async function (resolve, reject) {
        if(!id) return reject(new Error('no id specified'))
        else Task.findByIdAndUpdate(mongoose.Schema.Types.ObjectId(id), {
            task_type: mongoose.Schema.Types.ObjectId(task_type),
            title: title ? title : '',
            description: description ? description : '',
            status: status ? status : 'TO DO',
            due_date: due_date ? due_date : null,
            completion_date: status ? 'COMPLETED' : new Date()
        }, {}, (e, _item) => {
            if (e) return reject(e);
            else if (_item) return resolve({ label_id: _item._id });
            else return reject(new Error('Invalid id!'));
        });

    });
}

//array updates
exports.addlabel = async (id, label) => {
    return new Promise(async function (resolve, reject) {
        if (!id) return reject(new Error('no id specified'))
        else Task.findByIdAndUpdate(mongoose.Schema.Types.ObjectId(id), {
            $push: { label_ids: mongoose.Schema.Types.ObjectId(label) }
        }, {}, (e, _item) => {
            if (e) return reject(e);
            else if (_item) return resolve({ label_id: _item._id });
            else return reject(new Error('Invalid id!'));
        });
    });
}
exports.removelabel = async (id, label) => {
    return new Promise(async function (resolve, reject) {
        if (!id) return reject(new Error('no id specified'))
        else Task.findByIdAndUpdate(mongoose.Schema.Types.ObjectId(id), {
            $pull: { label_ids: mongoose.Schema.Types.ObjectId(label) }
        }, {}, (e, _item) => {
            if (e) return reject(e);
            else if (_item) return resolve({ label_id: _item._id });
            else return reject(new Error('Invalid id!'));
        });
    });
}

//update attachments

exports.incrementCounter = async (id) => {
    return new Promise(async function (resolve, reject) {

        if(!id) return reject(new Error('no id specified'));
        else try {

            let task = await module.exports.getOne(id);
            Task.findByIdAndUpdate(mongoose.Schema.Types.ObjectId(id), {
                counter: ++task.counter
            }, {}, (e, _item) => {
                if(e) return reject(e);
                else if(_item) {
                    _item.counter++;
                    return resolve(_item.counter);
                } else return reject(new Error('Invalid id'))
            })

        } catch(e) {
            return reject(e);
        }

    });
}
exports.updateAssignee = async (id, assignee_id) => {
    return new Promise(async function (resolve, reject) {
        if(!id) return reject(new Error('no id specified'))
        else if(!assignee_id) return reject(new Error('no assignee id specified'))
        else Task.findByIdAndUpdate(mongoose.Schema.Types.ObjectId(id), {
                assignee_id: mongoose.Schema.Types.ObjectId(assignee_id)
            }, {}, (e, _item) => {
                if (e) return reject(e);
                else if (_item) return resolve({ label_id: _item._id });
                else return reject(new Error('Invalid id!'));
            });
    });
}
exports.removeAssignee = async (id) => {
    return new Promise(async function (resolve, reject) {
        if(!id) return reject(new Error('no id specified'))
        else Task.findByIdAndUpdate(mongoose.Schema.Types.ObjectId(id), {
                assignee_id: null
            }, {}, (e, _item) => {
                if (e) return reject(e);
                else if (_item) return resolve({ label_id: _item._id });
                else return reject(new Error('Invalid id!'));
            });
    });
}

exports.deleteOne = async (id) => {
    return new Promise(async function (resolve, reject) {

        if(!id) return reject(new Error('No id specified'))
        else 
            Task.findByIdAndDelete(mongoose.Schema.Types.ObjectId(id), {}, (e, _item) => {
                if(e) return reject(e);
                else if(_item) {
                    //remove checklist items
                    //remove comments
                    return resolve(_item);
                }
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.deleteMany = async (sprint_id) => {
    return new Promise(async function (resolve, reject) {

        if(!sprint_id) return reject(new Error('No id specified'))
        else 
            Task.deleteMany({ sprint_id: mongoose.Schema.Types.ObjectId(sprint_id) }, {}, 
            (e, _item) => {
                if(e) return reject(e);
                else if(_item) {
                    //remove checklist items
                    //remove comments
                    return resolve(_item);
                }
                else return reject(new Error('Invalid id'))
            });
    });
}