var express = require('express');
var router = express.Router();

const auth_middleware = require('../middleware/verify_session');

const task_type_lib = require('../lib/task_type.lib');


/* GET */
router.get('/:task_typeID', auth_middleware.validate, async (req, res) => {
    try {

        let task_type = await task_type_lib.getOne(req.params.task_typeID);
        return res.status(200).send({
            message: 'Success!',
            task_type: task_type 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

router.get('/all/:boardID', auth_middleware.validate, async (req, res) => {
    try {

        let task_types = await task_type_lib.getAll(req.params.boardID);
        return res.status(200).send({
            message: 'Success!',
            task_types: task_types,
            count: task_types.length 
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

        let task_type = await task_type_lib.create(req.params.boardID, req.body.icon, req.body.title, req.body.color);
        return res.status(200).send({
            message: 'Success!',
            task_type: task_type 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* PUT */
router.put('/:task_typeID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let task_type_id = await task_type_lib.update(req.params.task_typeID, req.body.icon, req.body.title, req.body.color);
        return res.status(200).send({
            message: 'Success!',
            task_type_id: task_type_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
/* DELETE */
router.delete('/:task_typeID', auth_middleware.validate, async (req, res) => {
    try {

        let task_type = await task_type_lib.deleteOne(req.params.task_typeID);
        return res.status(200).send({
            message: 'Success!',
            task_type: task_type 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

module.exports = router;
