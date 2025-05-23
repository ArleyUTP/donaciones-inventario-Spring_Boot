const pool = require('../config/database');

exports.createUser = async (req, res) => {
    const { nombre_usuario, contrasena, nombre_completo, rol_id, email, telefono, es_donador } = req.body;
    try {
        await pool.query(
            'INSERT INTO usuarios (nombre_usuario, contrasena, nombre_completo, rol_id, email, telefono, es_donador, fecha_registro) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
            [nombre_usuario, contrasena, nombre_completo, rol_id, email, telefono, es_donador]
        );
        res.send('Usuario registrado con éxito');
    } catch (err) {
        console.log('Error al insertar usuario: ' + err);
        res.status(500).send('Error al insertar usuario');
    }
};

exports.registerUser = async (req, res) => {
    const { nombre_usuario, contrasena, nombre_completo, email, telefono, es_donador } = req.body;
    try {
        await pool.query(
            'INSERT INTO usuarios (nombre_usuario, contrasena, nombre_completo, email, telefono, es_donador ,ultimo_acceso) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
            [nombre_usuario, contrasena, nombre_completo, email, telefono, es_donador]
        );
        res.send('Usuario registrado con éxito');
    } catch (err) {
        console.log('err al insertar usuario: ' + err);
        res.status(500).send('err al insertar usuario');
    }
};
exports.updateUser = async (req,res)=>{
    const {nombre_usuario,contrasena,nombre_completo,rol,email,idUsuario} = req.body;
    const sql = 'UPDATE usuarios SET nombre_usuario = $1, contrasena = $2, nombre_completo = $3, rol = $4, email = $5 WHERE usuario_id = $6';
    try {
        await pool.query(sql,[nombre_usuario, contrasena, nombre_completo, rol, email, idUsuario])
        res.send('Usuario registrado correctamente');
    } catch (err) {
        console.log('err al actualizar usuario: '+err);
        res.status(500).send('err al actualizar usuario')
    }
}
exports.deleteUser = async (req,res)=>{
    const {idUsuario} = req.body;
    const sql = 'UPDATE usuarios SET rol = $1 WHERE usuario_id = $2';
    const values = ['eliminado',idUsuario];
    try {
        await pool.query(sql,values);
        res.send('Usuario eliminado correctamente');
    } catch (err) {
        console.log('err al eliminar usuario: '+err);
        res.status(500).send('err al eliminar usuario');
    }
}
exports.getUsers = async (req, res) => {
    const sql = `SELECT u.*, r.nombre as rol 
                 FROM usuarios u
                 LEFT JOIN roles r ON u.rol_id = r.id
                 WHERE r.nombre != 'eliminado'
                 ORDER BY u.id`;
    try {
        const result = await pool.query(sql);
        res.send(result.rows);
    } catch (err) {
        console.log('Error al obtener usuarios: ' + err);
        res.status(500).send('Error al obtener usuarios');
    }
};
