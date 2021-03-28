var express = require('express');
var router = express.Router();

const auth_middleware = require('../middleware/verify_session');

const board_lib = require('../lib/board.lib');


/* GET */
router.get('/:boardID', auth_middleware.validate, async (req, res) => {
    try {

        let board = await board_lib.getOne(req.params.boardID);
        return res.status(200).send({
            message: 'Success!',
            board: board 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

router.get('/all/:creatorID', auth_middleware.validate, async (req, res) => {
    try {

        let boards = await board_lib.getAll(req.params.creatorID);
        return res.status(200).send({
            message: 'Success!',
            boards: boards,
            count: boards.length 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.get('/all/:creatorID/favorite', auth_middleware.validate, async (req, res) => {
    try {

        let boards = await board_lib.getAllFavorite(req.params.creatorID);
        return res.status(200).send({
            message: 'Success!',
            boards: boards,
            count: boards.length 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.get('/all/:creatorID/non-favorite', auth_middleware.validate, async (req, res) => {
    try {

        let boards = await board_lib.getAllNonFavorite(req.params.creatorID);
        return res.status(200).send({
            message: 'Success!',
            boards: boards,
            count: boards.length 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* POST */
router.post('/', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let board = await board_lib.create(res.locals._id, req.body.title, req.body.description, req.body.counter_appendice);
        return res.status(200).send({
            message: 'Success!',
            board: board 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* PUT */
router.put('/:boardID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let board = await board_lib.update(req.params.boardID, req.body.title, req.body.description, req.body.favorite);
        return res.status(200).send({
            message: 'Success!',
            board_id: board.board_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
/* DELETE */
router.delete('/:boardID', auth_middleware.validate, async (req, res) => {
    try {

        let board = await board_lib.deleteOne(req.params.boardID);
        return res.status(200).send({
            message: 'Success!',
            board: board 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

module.exports = router;
