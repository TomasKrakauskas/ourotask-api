const bcrypt = require("bcrypt");

module.exports.hashPassword = (password, rounds) => { return bcrypt.hashSync(password, rounds); };
module.exports.verifyPassword = (string, password)=> { return bcrypt.compareSync(string, password); };