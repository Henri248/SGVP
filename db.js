const { Pool } = require('pg')

async function connect() {

    if (global.connection)
        return global.connection.connect();

    const pool = new Pool({
        user: 'postgres',
        //host: 'database.server.com',
        database: 'sgvp',
        password: '1234',
        port: 5432,
    })

    const client = await pool.connect()
    console.log("Criou pool de conexões no PostgreSQL! ")
    const res = await client.query('SELECT NOW()')
    console.log(res.rows[0])
    client.release()


    //await client.end()
    global.connection = pool;
    return pool.connect();
}

async function selectProdutos() {
    const client = await connect();
    const res = await client.query('SELECT id, nome, categoria, preco, estoque FROM produtos WHERE ativo = true');
    return res.rows;
}

async function validarUsuario() {
    const client = await connect();
    const res = await client.query('SELECT id, nome, categoria, preco, estoque FROM produtos WHERE ativo = true');
    return res.rows;
}

module.exports = { selectProdutos, validarUsuario }