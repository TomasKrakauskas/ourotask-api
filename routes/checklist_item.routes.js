var express = require('express');
var router = express.Router();

const auth_middleware = require('../middleware/verify_session');

const checklist_item_lib = require('../lib/checklist_item.lib');


/* GET */
router.get('/:checklist_itemID', auth_middleware.validate, async (req, res) => {
    try {

        let checklist_item = await checklist_item_lib.getOne(req.params.checklist_itemID);
        return res.status(200).send({
            message: 'Success!',
            checklist_item: checklist_item 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

router.get('/all/:boardID', auth_middleware.validate, async (req, res) => {
    try {

        let checklist_items = await checklist_item_lib.getAll(req.params.boardID);
        return res.status(200).send({
            message: 'Success!',
            checklist_items: checklist_items,
            count: checklist_items.length 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* POST */
router.post('/task/:taskID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let checklist_item = await checklist_item_lib.create(req.body.task_typeID, req.params.taskID, req.body.title);
        return res.status(200).send({
            message: 'Success!',
            checklist_item: checklist_item 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* PUT */
router.put('/:checklist_itemID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let checklist_item_id = await checklist_item_lib.update(req.params.checklist_itemID, req.body.task_type, req.body.status, req.body.title);
        return res.status(200).send({
            message: 'Success!',
            checklist_item_id: checklist_item_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
/* DELETE */
router.delete('/:checklist_itemID', auth_middleware.validate, async (req, res) => {
    try {

        let checklist_item = await checklist_item_lib.deleteOne(req.params.checklist_itemID);
        return res.status(200).send({
            message: 'Success!',
            checklist_item: checklist_item 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

module.exports = router;
