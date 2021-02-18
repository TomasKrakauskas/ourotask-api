var express = require('express');
var router = express.Router();

const auth_middleware = require('../middleware/verify_session');

const checklist_lib = require('../lib/checklist.lib');


/* GET */
router.get('/:checklistID', auth_middleware.validate, async (req, res) => {
    try {

        let checklist = await checklist_lib.getOne(req.params.checklistID);
        return res.status(200).send({
            message: 'Success!',
            checklist: checklist 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

router.get('/all/:taskID', auth_middleware.validate, async (req, res) => {
    try {

        let checklists = await checklist_lib.getAll(req.params.taskID);
        return res.status(200).send({
            message: 'Success!',
            checklists: checklists,
            count: checklists.length 
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

        let checklist = await checklist_lib.create(req.body.task_typeID, req.params.taskID, req.body.title);
        return res.status(200).send({
            message: 'Success!',
            checklist: checklist 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* PUT */
router.put('/:checklistID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let checklist_id = await checklist_lib.update(req.params.checklistID, req.body.task_type, req.body.status, req.body.title);
        return res.status(200).send({
            message: 'Success!',
            checklist_id: checklist_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
/* DELETE */
router.delete('/:checklistID', auth_middleware.validate, async (req, res) => {
    try {

        let checklist = await checklist_lib.deleteOne(req.params.checklistID);
        return res.status(200).send({
            message: 'Success!',
            checklist: checklist 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

module.exports = router;
