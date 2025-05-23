const pool = require('../config/database');

exports.getRoles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM roles ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener roles:', err);
        res.status(500).json({ error: 'Error al obtener roles' });
    }
};