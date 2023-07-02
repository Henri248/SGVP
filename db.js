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

// Usuários ----------------------------------------------------------
async function validarUsuario(email, senha) {
    const client = await connect();
    const res = await client.query(`SELECT * FROM usuarios WHERE email = '${email}' AND senha = '${senha}'`);
    if (res.rows.length > 0) {
        if (res.rows[0].gestor) {
            return [true, true];
        }
        return [true, false];
    } else {
        return [false];
    }
}

async function dadosUsuario(email) {
    const client = await connect();
    const res = await client.query(`SELECT vd.id, vd.nome, u.email, u.senha, vd.telefone, vd.endereco, vd.meta, vd.meta_atual FROM (SELECT * FROM vendedores WHERE email = '${email}') vd INNER JOIN usuarios u ON vd.email = u.email`);
    return res.rows;
}

async function updateUsuario(email, nome, novo_email, senha, telefone, endereco) {
    const client = await connect();
    const res = await client.query(`UPDATE usuarios SET email = '${novo_email}', senha = '${senha}' WHERE email = '${email}'`);
    client.query(`UPDATE vendedores SET nome = '${nome}', email = '${novo_email}', telefone = '${telefone}', endereco = '${endereco}' WHERE email = '${email}'`);
    return res.rows;
}

async function dadosGestor(email) {
    const client = await connect();
    const res = await client.query(`SELECT email, senha FROM usuarios WHERE email = '${email}'`);
    return res.rows;
}

async function updateGestor(email, novo_email, senha) {
    const client = await connect();
    const res = await client.query(`UPDATE usuarios SET email = '${novo_email}', senha = '${senha}' WHERE email = '${email}'`);
    return res.rows;
}

//Produtos -------------------------------------------------
async function selectProdutos() {
    const client = await connect();
    const res = await client.query('SELECT id, nome, categoria, preco, estoque, ativo FROM produtos WHERE ativo = true ORDER BY id');
    return res.rows;
}

async function selectProdutoID(id) {
    const client = await connect();
    const res = await client.query(`SELECT * FROM produtos WHERE id = ${id}`);
    return res.rows;
}

async function insertProduto(nome, categoria, preco, estoque, descricao, filename) {  
    const client = await connect();
    const res = await client.query(`INSERT INTO produtos (nome, categoria, preco, estoque, descricao, ativo, filename) VALUES ('${nome}', '${categoria}', ${preco}, ${estoque}, '${descricao}', true, '${filename}')`);
    return res.rows;
}

async function updateProdutoID(id, nome, categoria, preco, estoque, descricao, filename) {   
    const client = await connect();
    const res = await client.query(`UPDATE produtos SET nome = '${nome}', categoria = '${categoria}', preco = ${preco}, estoque = ${estoque}, descricao = '${descricao}', filename = '${filename}' WHERE id = ${id}`);
    return res.rows;
}

async function activeProdutoID(id, ativo) {   
    const client = await connect();
    const res = await client.query(`UPDATE produtos SET ativo = ${ativo}  WHERE id = ${id}`);
    return res.rows;
}

//Vendedores ---------------------------------------------------
async function selectVendedores() {
    const client = await connect();
    const res = await client.query('SELECT * FROM vendedores WHERE ativo = true ORDER BY id');
    return res.rows;
}

async function selectVendedorID(id) {
    const client = await connect();
    const res = await client.query(`SELECT * FROM vendedores WHERE id = ${id}`);
    return res.rows;
}

async function insertVendedor(nome, email, telefone, endereco, meta, meta_atual) {   
    const client = await connect();
    const res = await client.query(`INSERT INTO vendedores (nome, email, telefone, endereco, meta, meta_atual, ativo) VALUES ('${nome}', '${email}', '${telefone}', '${endereco}', ${meta}, ${meta_atual}, true)`);
    return res.rows;
}

async function updateMetaVendedorID(id, meta, meta_atual) {   
    const client = await connect();
    const res = await client.query(`UPDATE vendedores SET meta = ${meta}, meta_atual = ${meta_atual} WHERE id = ${id}`);
    return res.rows;
}

async function activeVendedorID(id, ativo) {   
    const client = await connect();
    const res = await client.query(`UPDATE vendedores SET ativo = ${ativo}  WHERE id = ${id}`);
    if (ativo) {
        client.query(`INSERT INTO usuarios (email, senha, gestor) VALUES((SELECT email FROM vendedores WHERE id = ${id}), '123', false)`);
    };
    return res.rows;
}


//Clientes -----------------------------------------------------
async function selectClientes() {
    const client = await connect();
    const res = await client.query('SELECT * FROM clientes');
    return res.rows;
}

async function selectClienteID(id) {
    const client = await connect();
    const res = await client.query(`SELECT * FROM clientes WHERE id = ${id}`);
    return res.rows;
}

async function insertCliente(nome, email, telefone, endereco) {   
    const client = await connect();
    const res = await client.query(`INSERT INTO clientes (nome, email, telefone, endereco) VALUES ('${nome}', '${email}', '${telefone}', '${endereco}')`);
    return res.rows;
}

async function updateClienteID(id, nome, email, telefone, endereco) {   
    const client = await connect();
    const res = await client.query(`UPDATE clientes SET nome = '${nome}', email = '${email}', telefone = '${telefone}', endereco = '${endereco}' WHERE id = ${id}`);
    return res.rows;
}

async function deleteClienteID(id) {   
    const client = await connect();
    const res = await client.query(`DELETE FROM clientes WHERE id = ${id}`);
    return res.rows;
}

//Vendas -----------------------------------------------------
async function selectVendas() {
    const client = await connect();
    const res = await client.query('SELECT v.id, vd.nome AS vendedor, c.nome AS cliente, SUM(p.preco * pv.quantidade) AS valor, to_char(v.data, \'DD/MM/YYYY HH24:MI:SS\') AS data FROM vendas v INNER JOIN vendedores vd ON v.id_vendedor = vd.id INNER JOIN clientes c ON v.id_cliente = c.id INNER JOIN produtos_vendas pv ON v.id = pv.id_venda INNER JOIN produtos p ON pv.id_produto = p.id GROUP BY v.id, vd.nome, c.nome, v.data ORDER BY data DESC');
    return res.rows;
}

async function selectVendasVendedorID(id) {
    const client = await connect();
    const res = await client.query(`SELECT v.id, vd.nome AS vendedor, c.nome AS cliente, SUM(p.preco * pv.quantidade) AS valor, to_char(v.data, \'DD/MM/YYYY HH24:MI:SS\') AS data FROM vendas v INNER JOIN (SELECT * FROM vendedores WHERE id = ${id}) vd ON v.id_vendedor = vd.id INNER JOIN clientes c ON v.id_cliente = c.id INNER JOIN produtos_vendas pv ON v.id = pv.id_venda INNER JOIN produtos p ON pv.id_produto = p.id GROUP BY v.id, vd.nome, c.nome, v.data ORDER BY data DESC`);
    return res.rows;
}

async function selectVendaID(id) {
    const client = await connect();
    const res = await client.query(`SELECT v.id, to_char(v.data, \'DD/MM/YYYY HH24:MI:SS\') AS data, vd.nome AS vendedor, c.nome AS cliente, SUM(p.preco * pv.quantidade) AS valor
	FROM (SELECT * FROM vendas WHERE id = ${id}) v
	INNER JOIN vendedores vd ON v.id_vendedor = vd.id
	INNER JOIN clientes c ON v.id_cliente = c.id
	INNER JOIN produtos_vendas pv ON v.id = pv.id_venda
	INNER JOIN produtos p ON pv.id_produto = p.id
	GROUP BY v.id, vd.nome, c.nome, v.data`);
    return res.rows;
}

async function insertVenda(id_vendedor, id_cliente) {   
    const client = await connect();
    const res = await client.query(`INSERT INTO vendas (id_vendedor, id_cliente, data) VALUES (${id_vendedor}, ${id_cliente}, NOW()) RETURNING *;`);
    return res.rows;
}

async function selectProdutosVenda(id_venda) {   
    const client = await connect();
    const res = await client.query(`SELECT p.id, p.nome, pv.quantidade, p.preco FROM (SELECT * FROM produtos_vendas WHERE id_venda = ${id_venda}) pv INNER JOIN produtos p ON pv.id_produto = p.id`);
    return res.rows;
}

async function insertProdutoVenda(id_venda, id_produto, quantidade) {   
    const client = await connect();
    const res = await client.query(`INSERT INTO produtos_vendas (id_venda, id_produto, quantidade) VALUES (${id_venda}, ${id_produto}, ${quantidade})`);
    return res.rows;
}

async function deleteVendaID(id) {   
    const client = await connect();
    const res = await client.query(`DELETE FROM vendas WHERE id = ${id}`);
    return res.rows;
}



module.exports = {connect,selectProdutos, selectProdutoID, insertProduto, updateProdutoID, activeProdutoID, selectVendedores, selectVendedorID, insertVendedor, updateMetaVendedorID, activeVendedorID, selectClientes, selectClienteID, insertCliente, updateClienteID, deleteClienteID, selectVendas, selectVendaID, insertVenda, selectProdutosVenda, insertProdutoVenda, deleteVendaID, validarUsuario, dadosUsuario, updateUsuario}

