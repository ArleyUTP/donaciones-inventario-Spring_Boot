const pool = require('../config/database')

exports.testDb = async (req, res) => {
    try {
        await pool.query('SELECT 1');
        console.log('Conexión Exitosa');
        res.send('Conexión Exitosa');
    } catch (err) {
        console.log('Error al conectar a la BD: ' + err);
        res.status(500).send('Error al conectar a la BD');
    }
};

exports.login = async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE nombre_usuario = $1 AND contrasena = $2 AND rol != $3',
            [nombre_usuario, contrasena, 'eliminado']
        );
        if (result.rows.length > 0) {
            res.json({ success: true, usuario: result.rows[0] });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.log('Error en login: ' + err);
        res.status(500).json({ success: false, error: 'Error en el servidor' });
    }
};