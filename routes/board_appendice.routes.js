var express = require('express');
var router = express.Router();

const auth_middleware = require('../middleware/verify_session');

const board_appendice_lib = require('../lib/board_appendice.lib');


/* GET */
router.get('/:board_appendiceID', auth_middleware.validate, async (req, res) => {
    try {

        let board_appendice = await board_appendice_lib.getOne(req.params.board_appendiceID);
        return res.status(200).send({
            message: 'Success!',
            board_appendice: board_appendice 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

router.get('/all/:boardID', auth_middleware.validate, async (req, res) => {
    try {

        let board_appendices = await board_appendice_lib.getAll(req.params.boardID);
        return res.status(200).send({
            message: 'Success!',
            board_appendices: board_appendices,
            count: board_appendices.length 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* POST */
router.post('/:boardID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let board_appendice = await board_appendice_lib.create(req.params.boardID, req.body.title, req.body.logo, req.body.url);
        return res.status(200).send({
            message: 'Success!',
            board_appendice: board_appendice 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* PUT */
router.put('/:board_appendiceID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let board_appendice_id = await board_appendice_lib.update(req.params.board_appendiceID, req.body.title, req.body.logo, req.body.url);
        return res.status(200).send({
            message: 'Success!',
            board_appendice_id: board_appendice_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
/* DELETE */
router.delete('/:board_appendiceID', auth_middleware.validate, async (req, res) => {
    try {

        let board_appendice = await board_appendice_lib.deleteOne(req.params.board_appendiceID);
        return res.status(200).send({
            message: 'Success!',
            board_appendice: board_appendice 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

module.exports = router;
