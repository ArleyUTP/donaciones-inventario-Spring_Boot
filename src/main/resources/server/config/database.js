const { Pool } = require('pg');
// ? Conectarse a una Base de datos en la nube

const pool = new Pool({
    host: 'aws-0-us-west-1.pooler.supabase.com',
    user: 'postgres.ozfwkihmyhrmfunwrxhu',
    password: 'x$ZVsb3!GDh3T2z',
    database: 'postgres',
    port: 6543,
    ssl: {
        rejectUnauthorized: false,
        require: true
    }
});

// ? Conectarse a una base de datos de forma local
// const pool = new Pool({
//     host: 'localhost',
//     user: 'postgres', // Cambiar si fuera necesario
//     password: '12345', //Contraseña que le pusiste a tu pgAdmin 4
//     database: 'donaciones_gestion', //Nombre de la base de datos donde estan tus tablas
//     port: 5432, //Puerto por default
// });

module.exports = pool;