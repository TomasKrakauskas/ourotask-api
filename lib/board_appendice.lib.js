const mongoose      = require('mongoose');

const Board_appendice = require('../models/board_appendice.model');

exports.create = async (board_id, title, logo, url) => {
    return new Promise(async function (resolve, reject) {

        if(!creator) return reject(new Error('No creator specified'))
        else {

            const board_appendice = new Board_appendice({
                board_id: mongoose.Schema.Types.ObjectId(board_id),
                title: title ? title : '',
                logo: logo ? logo : '',
                url: url ? url : '',
            });

            board_appendice.save().then(_item => {

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
            Board_appendice.findById(mongoose.Schema.Types.ObjectId(id)).exec((e, _item) => {
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
            Board_appendice.find({ board_id: mongoose.Schema.Types.ObjectId(board_id)})
            .exec((e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}

exports.update = async (id, title, logo, url) => {
    return new Promise(async function (resolve, reject) {
        if(!id) return reject(new Error('no id specified'))
        else Board_appendice.findByIdAndUpdate( mongoose.Schema.Types.ObjectId(id), {
            title: title ? title: '',
            logo: logo ? logo : '',
            url: url ? url : ''
        }, {}, (e, _item) => {
            if(e) return reject(e);
            else if(_item) return resolve({ board_appendice_id: _item._id });
            else return reject(new Error('Invalid id!'));
        });
    });
}

exports.deleteOne = async (id) => {
    return new Promise(async function (resolve, reject) {

        if(!id) return reject(new Error('No id specified'))
        else 
            Board_appendice.findByIdAndDelete(mongoose.Schema.Types.ObjectId(id), {}, (e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}
exports.deleteMany = async (board_id) => {
    return new Promise(async function (resolve, reject) {

        if(!board_id) return reject(new Error('No id specified'))
        else 
            Board_appendice.deleteMany({ board_id: mongoose.Schema.Types.ObjectId(board_id) }, {}, 
            (e, _item) => {
                if(e) return reject(e);
                else if(_item) return resolve(_item);
                else return reject(new Error('Invalid id'))
            });
    });
}