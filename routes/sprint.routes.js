var express = require('express');
var router = express.Router();

const auth_middleware = require('../middleware/verify_session');

const sprint_lib = require('../lib/sprint.lib');


/* GET */
router.get('/:sprintID', auth_middleware.validate, async (req, res) => {
    try {

        let sprint = await sprint_lib.getOne(req.params.sprintID);
        return res.status(200).send({
            message: 'Success!',
            sprint: sprint 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

router.get('/all/:boardID', auth_middleware.validate, async (req, res) => {
    try {

        let sprints = await sprint_lib.getAll(req.params.boardID);
        return res.status(200).send({
            message: 'Success!',
            sprints: sprints,
            count: sprints.length 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* POST */
router.post('/board/:boardID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let sprint = await sprint_lib.create(req.body.boardID, req.body.title, req.body.due_date);
        return res.status(200).send({
            message: 'Success!',
            sprint: sprint 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* PUT */
router.put('/:sprintID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let sprint_id = await sprint_lib.update(req.params.sprintID, req.body.title);
        return res.status(200).send({
            message: 'Success!',
            sprint_id: sprint_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.put('/complete/:sprintID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let sprint_id = await sprint_lib.complete(req.params.sprintID);
        return res.status(200).send({
            message: 'Success!',
            sprint_id: sprint_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
/* DELETE */
router.delete('/:sprintID', auth_middleware.validate, async (req, res) => {
    try {

        let sprint = await sprint_lib.deleteOne(req.params.sprintID);
        return res.status(200).send({
            message: 'Success!',
            sprint: sprint 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

module.exports = router;
