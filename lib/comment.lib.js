const mongoose      = require('mongoose');

const Comment = require('../models/comment.model');

exports.create = async (task_id, creator_id, reply, content) => {
    return new Promise(async function (resolve, reject) {

        if(!board_id) return reject(new Error('No creator specified'))
        else {

            const comment = new Comment({
                task_id: mongoose.Schema.Types.ObjectId(task_id),
                creator_id: mongoose.Schema.Types.ObjectId(creator_id),
                reply: mongoose.Schema.Types.ObjectId(reply),
                content: content ? content : '',
            });

            comment.save().then(_item => {

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
            Comment.findById(mongoose.Schema.Types.ObjectId(id)).exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.getAll = async (task_id) => {
    return new Promise(async function (resolve, reject) {

        if(!task_id) return reject(new Error('No task id specified'))
        else 
            Comment.find({ task_id: mongoose.Schema.Types.ObjectId(task_id)})
            .exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.getAllReplies = async (reply) => {
    return new Promise(async function (resolve, reject) {

        if(!task_id) return reject(new Error('No reply id specified'))
        else 
            Comment.find({ reply: mongoose.Schema.Types.ObjectId(reply)})
            .exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}

exports.deleteOne = async (id) => {
    return new Promise(async function (resolve, reject) {

        if(!id) return reject(new Error('No id specified'))
        else 
            Comment.findByIdAndDelete(mongoose.Schema.Types.ObjectId(id), {}, async (e, _item) => {
                if(e) return reject(e);
                else if(_item) {
                    try {
                        await module.exports.deleteManyReplies(_item._id);
                        return resolve(_item);
                    } catch(e) {
                        return reject(e);
                    }
                }
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.deleteMany = async (task_id) => {
    return new Promise(async function (resolve, reject) {

        if(!task_id) return reject(new Error('No id specified'))
        else 
            Comment.deleteMany({ task_id: mongoose.Schema.Types.ObjectId(task_id) }, {}, 
            (e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.deleteManyReplies = async (reply) => {
    return new Promise(async function (resolve, reject) {

        if(!reply) return reject(new Error('No reply id specified'))
        else 
            Comment.deleteMany({ reply: mongoose.Schema.Types.ObjectId(reply) }, {}, 
            (e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}