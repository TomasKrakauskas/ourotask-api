var express = require('express');
var router = express.Router();

const auth_middleware = require('../middleware/verify_session');

const task_lib = require('../lib/task.lib');

/* GET */
router.get('/:taskID', auth_middleware.validate, async (req, res) => {
    try {

        let task = await task_lib.getOne(req.params.taskID);
        return res.status(200).send({
            message: 'Success!',
            task: task 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

router.get('/sprint/:sprintID', auth_middleware.validate, async (req, res) => {
    try {

        let tasks = await task_lib.getAllSprint(req.params.sprintID);
        return res.status(200).send({
            message: 'Success!',
            tasks: tasks,
            count: tasks.length 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.get('/sprint/:sprintID/type/:task_typeID', auth_middleware.validate, async (req, res) => {
    try {

        let tasks = await task_lib.getAllType(req.params.sprintID, req.params.task_typeID);
        return res.status(200).send({
            message: 'Success!',
            tasks: tasks,
            count: tasks.length 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.get('/sprint/:sprintID/assignee/:assigneeID', auth_middleware.validate, async (req, res) => {
    try {

        let tasks = await task_lib.getAllAssignee(req.params.sprintID, req.params.assigneeID);
        return res.status(200).send({
            message: 'Success!',
            tasks: tasks,
            count: tasks.length 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.get('/sprint/:sprintID/status/:status', auth_middleware.validate, async (req, res) => {
    try {

        let tasks = await task_lib.getAllStatus(req.params.sprintID, req.params.status);
        return res.status(200).send({
            message: 'Success!',
            tasks: tasks,
            count: tasks.length 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.get('/sprint/:sprintID/creator/:creatorID', auth_middleware.validate, async (req, res) => {
    try {

        let tasks = await task_lib.getAllAssignee(req.params.sprintID, req.params.creatorID);
        return res.status(200).send({
            message: 'Success!',
            tasks: tasks,
            count: tasks.length 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* POST */
router.post('/:sprintID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let task = await task_lib.create(req.params.sprintID, res.locals._id, req.body.task_type, req.body.title, req.body.description, req.body.due_date);
        return res.status(200).send({
            message: 'Success!',
            task: task 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* PUT */
router.put('/:taskID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let task_id = await task_lib.update(req.params.taskID, req.body.task_type, req.body.title, req.body.description, req.body.status, req.body.due_date);
        return res.status(200).send({
            message: 'Success!',
            task_id: task_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.put('/:taskID/label', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let task_id = await task_lib.addlabel(req.params.taskID, req.body.label_id);
        return res.status(200).send({
            message: 'Success!',
            task_id: task_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.put('/:taskID/assignee', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let task_id = await task_lib.addlabel(req.params.taskID, req.body.assignee_id);
        return res.status(200).send({
            message: 'Success!',
            task_id: task_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* DELETE */
router.delete('/:taskID/label/:labelID', auth_middleware.validate, async (req, res) => {
    try {

        let task_id = await task_lib.removelabel(req.params.taskID, req.params.labelID);
        return res.status(200).send({
            message: 'Success!',
            task_id: task_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.delete('/:taskID/assignee', auth_middleware.validate, async (req, res) => {
    try {

        let task_id = await task_lib.removeAssignee(req.params.taskID);
        return res.status(200).send({
            message: 'Success!',
            task_id: task_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.delete('/:taskID', auth_middleware.validate, async (req, res) => {
    try {

        let task = await task_lib.deleteOne(req.params.taskID);
        return res.status(200).send({
            message: 'Success!',
            task: task 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

module.exports = router;
