const mongoose      = require('mongoose');

//models
const Board = require('../models/board.model');

//libraries
const board_appendice_lib   = require('./board_appendice.lib');
const label_lib             = require('./label.lib');
const task_type_lib         = require('./task_type.lib');
const sprint_lib            = require('./sprint.lib');

exports.create = async (creator, title, description, counter_appendice) => {
    return new Promise(async function (resolve, reject) {

        if(!creator) return reject(new Error('No creator specified'))
        else {

            const board = new Board({
                creator_id: mongoose.Schema.Types.ObjectId(creator),
                user_group_id: null,
                
                
                favorite: false,
                title: title ? title : '',
                description: description ? description : '',
                
                counter_appendice: counter_appendice ? counter_appendice : '',
                counter: 0,

                logo_url: null,
                background_url: null
            });

            board.save().then(async _item => {

                if(_item) {
                    try {
                        let sprint = await sprint_lib.createBacklog(_item._id, 'Backlog');
                        if(!sprint) throw Error('Backlog was not created, commencing board destruction');

                        return resolve(_item); 
                    } catch(e) {
                        await module.exports.deleteOne(_item._id);
                        return reject(new Error('Error during creation'));
                    }
                }
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
            Board.findById(mongoose.Schema.Types.ObjectId(id)).exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.getAll = async (creator) => {
    return new Promise(async function (resolve, reject) {

        if(!creator) return reject(new Error('No id specified'))
        else 
            Board.find({ creator_id: mongoose.Schema.Types.ObjectId(creator)})
            .exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.getAllFavorite = async (creator) => {
    return new Promise(async function (resolve, reject) {

        if(!creator) return reject(new Error('No id specified'))
        else 
            Board.find({ creator_id: mongoose.Schema.Types.ObjectId(creator), favorite: true })
            .exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}

exports.update = async (id, title, description, favorite) => {
    return new Promise(async function (resolve, reject) {
        if(!id) return reject(new Error('no id specified'))
        else Board.findByIdAndUpdate( mongoose.Schema.Types.ObjectId(id), {
            title: title ? title: '',
            description: description ? description : '',
            favorite: favorite ? favorite : false
        }, {}, (e, _item) => {
            if(e) return reject(e);
            else if(_item) return resolve({ board_id: _item._id });
            else return reject(new Error('Invalid id!'));
        });
    });
}
exports.incrementCounter = async (id) => {
    return new Promise(async function (resolve, reject) {

        if(!id) return reject(new Error('no id specified'));
        else try {

            let board = await module.exports.getOne(id);
            Board.findByIdAndUpdate(mongoose.Schema.Types.ObjectId(id), {
                counter: ++board.counter
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

//update background
//update logo

exports.deleteOne = async (id) => {
    return new Promise(async function (resolve, reject) {

        if(!id) return reject(new Error('No id specified'))
        else 
            Board.findByIdAndDelete(mongoose.Schema.Types.ObjectId(id), {}, async (e, _item) => {
                if(e) return reject(e);
                else if(_item) {
                    try {
                        await Promise.all([
                            board_appendice_lib.deleteMany(_item._id),
                            sprint_lib.deleteMany(_item._id),
                            label_lib.deleteMany(_item._id),
                            task_type_lib.deleteMany(_item._id)
                        ]);
                        return resolve(_item);
                    } catch(e) {
                        return reject(e)
                    }                    
                }
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.deleteMany = async (creator) => {
    return new Promise(async function (resolve, reject) {

        if(!creator) return reject(new Error('No id specified'))
        else 
            Board.deleteMany({ creator_id: mongoose.Schema.Types.ObjectId(creator) }, {}, 
            async (e, _item) => {
                if(e) return reject(e);
                else if(_item) {
                    try {
                        await Promise.all([
                            _item.map(async (_it) => await board_appendice_lib.deleteMany(_it._id)),
                            _item.map(async (_it) => await sprint_lib.deleteMany(_it._id)),
                            _item.map(async (_it) => await label_lib.deleteMany(_it._id)),
                            _item.map(async (_it) => await task_type_lib.deleteMany(_it._id))
                        ]);
                        return resolve(_item);
                    } catch(e) {
                        return reject(e)
                    }  
                }
                else return reject(new Error('Invalid id'))
            });
    });
}