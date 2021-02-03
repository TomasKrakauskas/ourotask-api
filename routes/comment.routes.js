var express = require('express');
var router = express.Router();

const auth_middleware = require('../middleware/verify_session');

const comment_lib = require('../lib/comment.lib');

/* GET */
router.get('/:commentID', auth_middleware.validate, async (req, res) => {
    try {

        let comment = await comment_lib.getOne(req.params.commentID);
        return res.status(200).send({
            message: 'Success!',
            comment: comment 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

router.get('/all/:taskID', auth_middleware.validate, async (req, res) => {
    try {

        let comments = await comment_lib.getAll(req.params.taskID);
        return res.status(200).send({
            message: 'Success!',
            comments: comments,
            count: comments.length 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});
router.get('/all/:replyID/replies', auth_middleware.validate, async (req, res) => {
    try {

        let comments = await comment_lib.getAllFavorite(req.params.replyID);
        return res.status(200).send({
            message: 'Success!',
            comments: comments,
            count: comments.length 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* POST */
router.post('/:taskID', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'Body cannot be empty!' });
    else try {

        let comment = await comment_lib.create(req.params.taskID, res.locals._id, req.body.reply, req.body.content);
        return res.status(200).send({
            message: 'Success!',
            comment: comment 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* PUT */

/* DELETE */
router.delete('/:commentID', auth_middleware.validate, async (req, res) => {
    try {

        let comment = await comment_lib.deleteOne(req.params.commentID);
        return res.status(200).send({
            message: 'Success!',
            comment: comment 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

module.exports = router;
