const express = require('express')
const db = require('./db')
const app = express()
const porta = 8000;


(async () => {
    console.log('Começou!');
 
    console.log('SELECT * FROM CLIENTES');
    const teste = await db.selectProdutos();
    console.log(teste);
})();


app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('Hello World, Sejam todos bem vindos ao primeiro Servidor Express')
})

app.get('/teste', (req, res) => {
    res.render('teste')
})

// GET
app.get('/dashboard', (req, res) => {
    res.render('pages/dashboard')
})

// GET -> Produto
app.get('/produto', (req, res) => {

    (async () => {
        console.log('Começou!');
     
        const produtos = await db.selectProdutos();

        console.log(produtos);
        res.render('pages/produto/produtos', {resposta: produtos})
        
    })();
    
})

app.get('/produto/criar', (req, res) => {
    res.render('pages/produto/criarProduto')
})

app.get('/produto/editar', (req, res) => {
    res.render('pages/produto/editarProduto')
})

app.get('/produto/ver', (req, res) => {
    res.render('pages/produto/verProduto')
})

// GET -> Venda
app.get('/venda', (req, res) => {
    res.render('pages/venda/vendas')
})

app.get('/venda/criar', (req, res) => {
    res.render('pages/venda/criarVenda')
})

app.get('/venda/editar', (req, res) => {
    res.render('pages/venda/editarVenda')
})

app.get('/venda/ver', (req, res) => {
    res.render('pages/venda/verVenda')
})


// GET -> Vendedor
app.get('/vendedor', (req, res) => {
    res.render('pages/vendedor/vendedores')
})

app.get('/vendedor/criar', (req, res) => {
    res.render('pages/vendedor/criarVendedor')
})

app.get('/vendedor/editar', (req, res) => {
    res.render('pages/vendedor/editarVendedor')
})

app.get('/vendedor/ver', (req, res) => {
    res.render('pages/vendedor/verVendedor')
})


// GET -> Outros
app.get('/login', (req, res) => {
    res.render('pages/login')
})

app.get('/perfil', (req, res) => {
    res.render('pages/perfil')
})



// Inicio do Servidor
app.listen(porta, () => {
    console.log('Servidor iniciado com Sucesso. Porta ->', + porta)
})