const Users = require('../model/UserModel.js');

const getUser = async(req, res) => {
    try {
        const users = await Users.findAll();
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

const registerUser = async(req, res) => {
    const { name, email, password, confirmPassword }  = req.body;
    if(password !== confirmPassword) {
        return res.status(400).json({msg: "Password tidak sama"});
    }

    try {
        const existingUser = await Users.findOne({ where: { email: email } });

        if (existingUser) {
            return res.status(400).json({ msg: "Email sudah digunakan" });
        }

        await Users.create({
            name: name,
            email: email,
            password: password,
        });
        res.json({msg: "Register Berhasil"})
    } catch (error) {
        console.log(error);
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ msg: 'Email Not Found' });
        }

        if(user.password !== password) {
            return res.status(400).json({ msg: 'Wrong Password' });
        }

        req.session.userId = user.id;
        req.session.role = user.role;

        res.json({ msg: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const permissionCheck = (req, res) => {
    if (req.session.userId && req.session.role === 'admin') {
        res.json({ msg: 'This is an admin route' });
    } else if (!req.session.userId) {
        res.status(401).json({ msg: 'Not authenticated' });
    } else {
        res.status(403).json({ msg: 'Forbidden: Insufficient permissions' });
    }
};


module.exports = { getUser, registerUser, loginUser, permissionCheck };