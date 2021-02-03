var express = require('express');
var router = express.Router();

const auth_middleware = require('../middleware/verify_session');

const user_group_lib = require('../lib/user_group.lib');


/* GET */
router.get('/:groupID', auth_middleware.validate, async (req, res) => {
    try {

        let user_group = await user_group_lib.getOne(req.params.groupID);
        return res.status(200).send({
            message: 'Success!',
            user_group: user_group 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

router.get('/all/:creatorID', auth_middleware.validate, async (req, res) => {
    try {

        let user_groups = await user_group_lib.getAll(req.params.creatorID);
        return res.status(200).send({
            message: 'Success!',
            user_groups: user_groups,
            count: user_groups.length 
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

        let user_group = await user_group_lib.create(res.locals._id, req.body.title);
        return res.status(200).send({
            message: 'Success!',
            user_group: user_group 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* PUT */
router.put('/:groupID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let user_group_id = await user_group_lib.update(req.params.groupID, req.body.title);
        return res.status(200).send({
            message: 'Success!',
            user_group_id: user_group_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.put('/:groupID/user', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let user_group_id = await user_group_lib.addUser(req.params.groupID, req.body.user_id);
        return res.status(200).send({
            message: 'Success!',
            user_group_id: user_group_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* DELETE */
router.delete('/:groupID/user/:userID', auth_middleware.validate, async (req, res) => {
    try {

        let user_group_id = await user_group_lib.removeUser(req.params.groupID, req.params.userID);
        return res.status(200).send({
            message: 'Success!',
            user_group_id: user_group_id 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.delete('/:groupID', auth_middleware.validate, async (req, res) => {
    try {

        let user_group = await user_group_lib.deleteOne(req.params.groupID);
        return res.status(200).send({
            message: 'Success!',
            user_group: user_group 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

module.exports = router;
