const { get } = require('http');
const { dbConnection } = require('../db_connections');
const TABLE_PREFIX = 'tbl_50_preferences';
const {vacation_destinations} = require('../data/vacation_destination.json');
const {vacation_types} = require('../data/vacation_types.json');

exports.preferencesController = {
    async getPreferences(req,res){
        const connection = await dbConnection.createConnection();
        try {
            const [result] = await connection.execute(
                `SELECT * FROM ${TABLE_PREFIX}`
            );
            res.status(200).json(result);
        } catch (e) {
            res.status(500).json({ error: e.message });
        } finally {
           await connection.end();
        }
    },
    async getPreferenceByUserName(req,res){
        const connection = await dbConnection.createConnection();
        try {
            const [result] = await connection.execute(
                `SELECT user_id,start_date,end_date,vacation_destination,vacation_type
                FROM tbl_50_preferences
                INNER JOIN tbl_50_users ON tbl_50_preferences.user_id = tbl_50_users.id
                WHERE tbl_50_users.user_name = ?`,
                [req.params.username]
            );
            if (result.length === 0) {
                return res.status(404).json({ error: 'Preferences not found' });
            }
            res.status(200).json(result);
        } catch (e) {
            res.status(500).json({ error: e.message });
        } finally {
            await connection.end();
        }
    },
    async addPreference(req,res){
        const {username} = req.params;
        const {start_date,end_date,vacation_destination,vacation_type,access_key} = req.body;
        if (!start_date || !end_date || !vacation_destination || !vacation_type||!access_key) {
            res.status(400).send('start_date, end_date, vacation_destination and vacation_type are required:');
            return;
        }
        if (!(vacation_destinations.includes(vacation_destination))) {
            res.status(400).send('vacation_destination is not valid:');
            return;
        }
        if (!(vacation_types.includes(vacation_type))) {
            res.status(400).send('vacation_type is not valid:');
            return;
        }
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        if (isNaN(startDate) || isNaN(endDate)) {
            res.status(400).send('Invalid start_date or end_date.');
            return;
        }
        const differenceInMilliseconds = endDate - startDate;
        const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
        if (differenceInDays > 7) {
            res.status(400).send('vacation cannot be longer than a week');
            return;
        }
        const connection = await dbConnection.createConnection();
        try {
            const [result] = await connection.execute(
                `SELECT id,access_key FROM tbl_50_users WHERE user_name = ?`,
                [username]
            );
            if (result.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (result[0].access_key !== access_key){
                return res.status(403).json({ error: 'Access key is not valid' });
            }
            const user_id = result[0].id;
            const [insertResult] = await connection.execute(
                `INSERT INTO ${TABLE_PREFIX} (user_id, start_date, end_date, vacation_destination, vacation_type) VALUES (?, ?, ?, ?, ?)`,
                [user_id, start_date, end_date, vacation_destination, vacation_type]
            );
            if (insertResult.affectedRows === 0) {
                return res.status(500).json({ error: 'Internal server error at add preference' });
            }
            res.status(201).json({
                message: 'Preference added successfully'
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        } finally {
            await connection.end();
        }
    },
    }

};