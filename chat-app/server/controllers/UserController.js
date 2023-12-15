const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, resp, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({username});
        if(usernameCheck) {
            return resp.json({msg: 'Username already used', status: false}); 
        }
        const emailCheck = await User.findOne({email});
        if(emailCheck) {
            return resp.json({msg: 'Email already used', status: false}); 
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });
        delete user.password;
        return resp.json({status: true, user});
    }
    catch(err) {
        next(err);
    }
};