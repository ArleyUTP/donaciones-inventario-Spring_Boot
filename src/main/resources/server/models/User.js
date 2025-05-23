const pool = require('../config/database');

class User {
    static async create(userData) {
        const { nombre_usuario, contrasena, nombre_completo, rol, email } = userData;
        const result = await pool.query(
            'INSERT INTO usuarios (...) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
            [nombre_usuario, contrasena, nombre_completo, rol, email]
        );
        return result.rows[0];
    }
}

module.exports = User;