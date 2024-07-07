const { dbConnection } = require('../db_connections');
const TABLE_PREFIX = 'tbl_50_users';

exports.usersController = {
    async register(req, res) {
        const {username,password} = req.body;
        if (!username || !password) {
            res.status(400).send('username and password are required:');
            return;
        }
        const connection = await dbConnection.createConnection();
        try {
            const [users] = await connection.execute(`SELECT user_name FROM ${TABLE_PREFIX}`);
            if (users.length >= 5){
                res.status(400).json({ error: 'Only 5 users required' });
                return;
            }
            const access_key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const [result] = await connection.execute(
                `INSERT INTO ${TABLE_PREFIX} (user_name, password, access_key) VALUES (?, ?, ?)`,
                [username, password,access_key]
            );
            if (result.affectedRows === 0) {
                return res.status(500).json({ error: 'Internal server error at register user' });
            }
            res.status(201).json({
                message: 'User registered successfully',
                access_token: access_key
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        } finally {
            await connection.end();
        }

    }

}