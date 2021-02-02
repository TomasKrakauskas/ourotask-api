module.exports.validate_email = async (email) => {
    return new Promise(async function(resolve, reject) {
        try {
            if(!email) return reject(new Error('email empty!'));
            if(email.indexOf('@') == -1) return reject(new Error('not valid email!'));
            else if(email.substring(email.indexOf('@')).indexOf('.') == -1) return reject(new Error('not valid email!'));
            else return resolve(email);
        } catch(err) { return reject(err); }
    });
}
