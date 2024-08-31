const Users = require('../model/UserModel.js');
const { generateSessionId } = require('../service/LoginService.js')

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
        return res.status(400).json({msg: "Password is not identical"});
    }

    try {
        const existingUser = await Users.findOne({ where: { email: email } });

        if (existingUser) {
            return res.status(400).json({ msg: "Email already in use" });
        }

        await Users.create({
            name: name,
            email: email,
            password: password,
        });
        res.json({msg: "Register successful"})
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

        if (user.password !== password) {
            return res.status(400).json({ msg: 'Wrong Password' });
        }

        if (user.sessionId) {
            return res.status(400).json({ msg: "User already logged in from another session" });
        }

        const sessionId = generateSessionId(); 
        await user.update({ sessionId }); 

        req.session.userId = user.id;
        req.session.role = user.role;
        req.session.sessionId = sessionId; 

        console.log('Session data:', req.session);

        res.json({ 
            msg: 'Login successful',
            sessionId: sessionId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const checkSession = async (req, res) => {
    const { sessionId } = req.query;

    if (!sessionId) {
        return res.status(400).json({ msg: 'Session ID is required' });
    }

    try {
        const user = await Users.findOne({ where: { sessionId } });

        if (!user) {
            return res.status(401).json({ msg: 'No active session found for this session ID' });
        }

        res.json({
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            sessionId: user.sessionId
        });
    } catch (error) {
        console.error('Error checking session:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};


const logoutUser = async (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({ msg: 'Session ID is required' });
    }

    try {
        const user = await Users.findOne({ where: { sessionId } });

        if (!user) {
            return res.status(400).json({ msg: 'No user found with this session ID' });
        }

        await user.update({ sessionId: null });

        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ msg: 'Failed to logout' });
            }
            res.json({ msg: 'Logout successful' });
        });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!id) {
        return res.status(400).json({ msg: 'User ID is required' });
    }

    try {
        const user = await Users.findByPk(id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.update({ name, email, role });

        res.json({ msg: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { getUser, registerUser, loginUser, checkSession, logoutUser, updateUser };