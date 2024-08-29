const Users = require('../model/UserModel.js');

const getUser = async(req, res) => {
    try {
        const users = await Users.findAll();
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getUser };