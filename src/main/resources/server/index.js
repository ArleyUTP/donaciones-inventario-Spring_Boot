// const express = require('express');
// const app = express();
// const { Pool } = require('pg');
// const cors = require('cors');

// app.use(cors());
// app.use(express.json());
// // const pool = new Pool({
// //     host: 'localhost',
// //     user: 'postgres',
// //     password: '12345',
// //     database: 'gestor_donaciones',
// // });
// const pool = new Pool({
//     host: 'aws-0-us-west-1.pooler.supabase.com',
//     user: 'postgres.ozfwkihmyhrmfunwrxhu',
//     password: 'x$ZVsb3!GDh3T2z',
//     database: 'postgres',
//     port: 6543,
//     ssl: {
//         rejectUnauthorized: false,
//         require: true
//     }
// });
// // Método para probar la conexión a PostgreSQL
// app.get('/test-db', async (req, res) => {
//     try {
//         await pool.query('SELECT 1');
//         console.log('Conexión Exitosa');
//         res.send('Conexión Exitosa');
//     } catch (err) {
//         console.log('Error al conectar a la BD: ' + err);
//         res.status(500).send('Error al conectar a la BD');
//     }
// });

// // Para enviar datos al servidor (los datos son enviados en el cuerpo de la solicitud)
// app.post('/create', async (req, res) => {
//     const { nombre_usuario, contrasena, nombre_completo, rol, email } = req.body;

//     try {
//         await pool.query(
//             'INSERT INTO usuarios (nombre_usuario, contrasena, nombre_completo, rol, email, ultimo_acceso) VALUES ($1, $2, $3, $4, $5, NOW())',
//             [nombre_usuario, contrasena, nombre_completo, rol, email]
//         );
//         res.send('Usuario registrado con éxito');
//     } catch (err) {
//         console.log('Error al insertar usuario: ' + err);
//         res.status(500).send('Error al insertar usuario');
//     }
// });
// app.post('/registro/create', async (req, res) => {
//     const { nombre_usuario, contrasena, nombre_completo, email,telefono,es_donador } = req.body;
//     try {
//         await pool.query(
//             'INSERT INTO usuarios (nombre_usuario, contrasena, nombre_completo, email, telefono, es_donador ,ultimo_acceso) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
//             [nombre_usuario, contrasena, nombre_completo,email, telefono, es_donador]
//         );
//         res.send('Usuario registrado con éxito');
//     } catch (err) {
//         console.log('Error al insertar usuario: ' + err);
//         res.status(500).send('Error al insertar usuario');
//     }
// });
// app.put('/update', async (req, res) => {
//     const { nombre_usuario, contrasena, nombre_completo, rol, email, idUsuario } = req.body;
//     try {
//         await pool.query(
//             'UPDATE usuarios SET nombre_usuario = $1, contrasena = $2, nombre_completo = $3, rol = $4, email = $5 WHERE usuario_id = $6',
//             [nombre_usuario, contrasena, nombre_completo, rol, email, idUsuario]
//         );
//         res.send('Usuario registrado con éxito');
//     } catch (err) {
//         console.log('Error al actualizar usuario: ' + err);
//         res.status(500).send('Error al insertar usuario');
//     }
// });
// app.get('/usuarios', async (req, res) => {
//     try {
//         const result = await pool.query('SELECT * FROM usuarios ORDER BY usuario_id');
//         res.send(result.rows);
//     } catch (err) {
//         console.log('Error al recuperar datos: ' + err);
//         res.status(500).send('Error al recuperar datos');
//     }
// });
// app.put('/delete', async (req, res) => {
//     const { idUsuario } = req.body;
//     try {
//         await pool.query(
//             'UPDATE usuarios SET rol = $1 WHERE usuario_id = $2',
//             ['eliminado', idUsuario]
//         );
//         res.send('Usuario marcado como eliminado');
//     } catch (err) {
//         console.log('Error al eliminar usuario: ' + err);
//         res.status(500).send('Error al eliminar usuario');
//     }
// });
// app.post('/login', async (req, res) => {
//     const { nombre_usuario, contrasena } = req.body;
//     try {
//         const result = await pool.query(
//             'SELECT * FROM usuarios WHERE nombre_usuario = $1 AND contrasena = $2 AND rol != $3',
//             [nombre_usuario, contrasena, 'eliminado']
//         );
//         if (result.rows.length > 0) {
//             // Usuario encontrado y no eliminado
//             res.json({ success: true, usuario: result.rows[0] });
//         } else {
//             // Usuario no encontrado o eliminado
//             res.json({ success: false });
//         }
//     } catch (err) {
//         console.log('Error en login: ' + err);
//         res.status(500).json({ success: false, error: 'Error en el servidor' });
//     }
// });
// app.listen(3000, () => {
//     console.log('La aplicación esta ejecutandose en el puerto 3000');
// });

// /**
//  * * Donadores
//  * ! Gestion de donadores
//  * ? Gestion de donadores
//  */
// app.post('/donadores/create', async (req, res) => {
//     const { nombre, email, telefono, tipo } = req.body;
//     try {
//         await pool.query(
//             'INSERT INTO donadores (nombre, email, telefono, tipo) VALUES ($1, $2, $3, $4)',
//             [nombre, email, telefono, tipo]
//         );
//         res.send('Donador registrado con éxito');
//     } catch (err) {
//         console.log('Error al insertar donador: ' + err);
//         res.status(500).send('Error al insertar donador');
//     }
// });
// app.put('/donadores/update', async (req, res) => {
//     const { donador_id, nombre, email, telefono, tipo } = req.body;
//     try {
//         await pool.query(
//             'UPDATE donadores SET nombre = $1, email = $2, telefono = $3, tipo = $4 WHERE donador_id = $5',
//             [nombre, email, telefono, tipo, donador_id]
//         );
//         res.send('Donador actualizado con éxito');
//     } catch (err) {
//         console.log('Error al actualizar donador: ' + err);
//         res.status(500).send('Error al actualizar donador');
//     }
// });
// app.get('/donadores', async (req, res) => {
//     try {
//         const result = await pool.query(`
//             SELECT 
//                 donador_id as id,
//                 nombre,
//                 email,
//                 telefono,
//                 tipo,
//                 fecha_registro,
//                 'donador' AS tipo_registro
//             FROM donadores
//             WHERE tipo != 'eliminado'
            
//             UNION ALL
            
//             SELECT 
//                 usuario_id AS id,
//                 nombre_completo AS nombre,
//                 email,
//                 telefono,
//                 'persona' AS tipo,
//                 ultimo_acceso AS fecha_registro,
//                 'usuario' AS tipo_registro
//             FROM usuarios
//             WHERE es_donador = TRUE
//             ORDER BY id
//         `);
//         res.send(result.rows);
//     } catch (err) {
//         console.log('Error al recuperar donadores: ' + err);
//         res.status(500).send('Error al recuperar donadores');
//     }
// });
// app.put('/donadores/delete', async (req, res) => {
//     const { donador_id } = req.body;
//     try {
//         await pool.query(
//             "UPDATE donadores SET tipo = $1 WHERE donador_id = $2",
//             ['eliminado', donador_id]
//         );
//         res.send('Donador marcado como eliminado');
//     } catch (err) {
//         console.log('Error al eliminar donador: ' + err);
//         res.status(500).send('Error al eliminar donador');
//     }
// });
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
// const donorRoutes = require('./routes/donorRoutes');
const roleRoutes = require('./routes/roleRoutes');
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/role', roleRoutes);
// app.use('/donors', donorRoutes);

app.listen(3000, () => {
    console.log('Servidor ejecutándose en puerto 3000');
});