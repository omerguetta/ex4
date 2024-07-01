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
    }

};