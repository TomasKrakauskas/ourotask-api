var express = require('express');
var router = express.Router();

const auth_middleware = require('../middleware/verify_session');

const label_lib = require('../lib/label.lib');


/* GET */
router.get('/:labelID', auth_middleware.validate, async (req, res) => {
    try {

        let label = await label_lib.getOne(req.params.labelID);
        return res.status(200).send({
            message: 'Success!',
            label: label 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

router.get('/all/:boardID', auth_middleware.validate, async (req, res) => {
    try {

        let labels = await label_lib.getAll(req.params.boardID);
        return res.status(200).send({
            message: 'Success!',
            labels: labels,
            count: labels.length 
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

        let label = await label_lib.create(req.params.boardID, req.body.title, req.body.color);
        return res.status(200).send({
            message: 'Success!',
            label: label 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* PUT */
router.put('/:labelID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let label_id = await label_lib.update(req.params.labelID, req.body.title, req.body.color);
        return res.status(200).send({
            message: 'Success!',
            label_id: label_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
/* DELETE */
router.delete('/:labelID', auth_middleware.validate, async (req, res) => {
    try {

        let label = await label_lib.deleteOne(req.params.labelID);
        return res.status(200).send({
            message: 'Success!',
            label: label 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

module.exports = router;
