var express = require('express');
var router = express.Router();

const auth_middleware = require('../middleware/verify_session');

const auth = require('../lib/auth.lib');
const users = require('../lib/users.lib');

/* GET check login status */
router.get('/check', auth_middleware.validate, async (req, res) => {
    return res.status(200).send({ message: 'OK!' });
});
/* DELETE logout */
router.delete('/logout', auth_middleware.validate, async (req, res) => {
    return res.status(200).send({ message: 'OK!' });
});

/* GET logged in user information */
router.get('/', auth_middleware.validate, async (req, res) => {
    try {

        let user = await users.getUser_byID(res.locals._id);
        return res.status(200).send({
            message: 'Success!',
            user: {
                _id: user._id,

                alias: user.alias ? user.alias : '',
                email: user.email ? user.email : '',
            }
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' });
    }
});

/* POST login. */
router.post('/', async (req, res) => {

    if (!req.body) return res.status(400).send({ message: 'body cannot be empty!' });
    else if (!req.body.email) return res.status(400).send({ message: 'email cannot be empty!' });
    else if (!req.body.password) return res.status(400).send({ message: 'password cannot be empty!' });
    else try {

        var user = await auth.login(req.body.email, req.body.password);
        if (!user) return res.status(401).send({ message: 'Unauthorized!' });
        else {
            let token = jwt.sign({
                _id: user._id,
                expiration_date: new Date().setMinutes(new Date().getMinutes() + 15)
            }, process.env.TOKEN_SECRET, { expiresIn: 15 * 60 });

            let refresh = jwt.sign({
                _id: user._id,
                expiration_date: new Date().setHours(new Date().getHours() + 8)
            }, process.env.TOKEN_SECRET, { expiresIn: 8 * 60 * 60 });

            return res.status(200).send({
                message: 'Success!',
                token: token,
                refresh: refresh,
                user: {
                    _id: user._id,

                    alias: user.alias,
                    email: user.email,
                }
            });
        }

    } catch (e) {
        console.log(e);
        return res.status(500).send({
            message: 'Something went wrong!'
        });

    }
});
/* POST refresh session */
router.post('/refresh', auth_middleware.refresh, async (req, res) => {
    try {
        let user = await users.getUser_byID(res.locals._id);


        let token = jwt.sign({
            _id: user._id,
            expiration_date: new Date().setMinutes(new Date().getMinutes() + 15)
        }, process.env.TOKEN_SECRET, { expiresIn: 15 * 60 });

        let refresh = jwt.sign({
            _id: user._id,
            expiration_date: new Date().setHours(new Date().getHours() + 8)
        }, process.env.TOKEN_SECRET, { expiresIn: 8 * 60 * 60 });

        return res.status(200).send({
            message: 'Success!',
            token: token,
            refresh: refresh,
            user: {
                _id: user._id,

                alias: user.alias,
                email: user.email,
            }
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send({
            message: 'Something went wrong!'
        });
    }
});

/*POST register*/
router.post('/register', async (req, res) => {
    if (!req.body) return res.status(400).send({ message: 'body cannot be empty!' });
    else if (!req.body.name) return res.status(400).send({ message: 'name cannot be empty!' });
    else if (!req.body.email) return res.status(400).send({ message: 'email cannot be empty!' });
    else if (!req.body.password) return res.status(400).send({ message: 'password cannot be empty!' });
    else try {

        let validator = passwordValidator(req.body.password);

        // console.log(req.body.password)
        if (!validator.value) return res.status(406).send({ message: validator.error });
        else {
            let response = await auth.register(req.body.alias, req.body.email, req.body.password);
            if (response) {
                //   await email_lib.company_creation(response.user.email, process.env.WEB + 'login');
            }
            return res.status(200).send({
                message: 'Success!'
            });
        }


    } catch (e) {
        console.log(e);
        if (e.message == 'not valid email!') return res.status(400).send({ message: 'Email not valid!' });
        else if (e.message.indexOf('E11000') != -1) return res.status(409).send({ message: 'Email is taken!' });
        else return res.status(500).send({ message: 'Something went wrong!' });
    }
});


/*PUT request password reset*/
router.put('/reset', async (req, res) => {
    if (!req.body) return res.status(400).send({ message: 'body cannot be empty!' });
    else if (!req.body.email) return res.status(400).send({ message: 'email cannot be empty!' });
    else try {

        let user_id = await auth.requestPasswordReset(req.body.email);
        let user = await users.getUser_byID(user_id);
        if (user) {

            // console.log(user);
            let url = process.env.WEB + 'reset?email=' + user.email + '&secret=' + user.reset_token;
            // let resp = await email_lib.password_reset(user.email, url);  
            return res.status(200).send({
                message: 'Success!'
            });

        } else return res.status(500).send({ message: 'Something went wrong!' });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' })
    }
});

/*PUT password reset*/
router.put('/reset/:token', async (req, res) => {
    if (!req.body) return res.status(400).send({ message: 'body cannot be empty!' });
    else if (!req.body.email) return res.status(400).send({ message: 'email cannot be empty!' });
    else try {

        let user_id = await auth.resetPassword(req.params.token, req.body.email, req.body.password);
        if (user_id) {
            // console.log(user_id);
            let user = await users.getUser_byID(user_id);
            // let resp = await email_lib.password_updated(user.email);

            return res.status(200).send({
                message: 'Success!'
            });

        } else return res.status(500).send({ message: 'Something went wrong!' });


    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Something went wrong!' })
    }
});

/*DELETE logged in user*/
router.delete('/', auth_middleware.validate, async (req, res) => {
    if(!req.body) return res.status(400).send({ message: 'body cannot be empty!' });
    else {
        if(req.body.confirm == 'SOMETHING') {
            await users.removeUser(res.locals._id)
            return res.status(200).send({
                message: 'Success!'
            });
        }
        return res.status(400).send({ message: 'No confirmation message!' });
    }
});





module.exports = router;


function passwordValidator(password) {
    if (!password) return { value: false, error: 'Password cannot be empty!' }
    if (password.length < 6) return { value: false, error: 'Must be longer than 6 characters' }
    let upper = 0;
    let lower = 0;
    for (let i = 0; i < password.length; i++) {
        if (password[i] == password[i].toLowerCase()) lower++;
        if (password[i] == password[i].toUpperCase()) upper++;
    }
    if (!upper) return { value: false, error: 'Must contain atleast 1 upper case letter' }
    if (!lower) return { value: false, error: 'Must contain atleast 1 lower case letter' }
    if (password.replace(/\D/g, '').length <= 0) return { value: false, error: 'Must contain atleast 1 digit' }
    if (password.replace(/[A-Za-z0-9]/g, '').length <= 0) return { value: false, error: 'Must contain atleast 1 symbol' }

    return { value: true, error: null }
}
