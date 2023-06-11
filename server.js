const express = require('express')
const db = require('./db')
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts')



const app = express()
const porta = 8000;



app.set('view engine', 'ejs')



app.use(express.static('public'))

app.use(cookieParser())
app.use(expressLayouts)

app.get('/', (req, res) => {
    console.log(req.cookies)
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
     
        const p = await db.selectProdutos();

        console.log(p);
        res.render('pages/produto/produtos', {produtos: p})
        
    })();
    
})

app.get('/produto/criarProduto', (req, res) => {
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
    (async () => {
        console.log('Começou!');
     
        const v = await db.selectProdutos();

        console.log(v);
        res.render('pages/venda/vendas', {vendas: v})
    })();
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
    (async () => {
        console.log('Começou!');
     
        const v = await db.selectProdutos();

        console.log(v);
        res.render('pages/vendedor/vendedores', {vendedores: v})
    })();
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