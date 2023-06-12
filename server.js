const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts')



const app = express()
const porta = 8000;



app.set('view engine', 'ejs')


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(cookieParser())
app.use(expressLayouts)


app.get('/', (req, res) => {
    console.log(req.cookies)
    res.send('Hello World, Sejam todos bem vindos ao primeiro Servidor Express')
})

app.get('/teste', (req, res) => {
    console.log(req.cookies)
})

// USUARIO --------------------------------------------------------------

// GET -> Login
app.get('/login', (req, res) => {
    res.clearCookie('email')
    res.clearCookie('gestor')
    res.render('pages/login', { email: false, gestor: false })
})

// POST -> Login
app.post('/verifica_login', (req, res) => {
    const { email, senha } = req.body;
    (async () => {
        const login = await db.validarUsuario(email, senha);
        if (login[0]) {
            res.cookie('email', email);
            res.cookie('gestor', login[1]);
            res.redirect('/dashboard')
        } else {
            res.redirect('/login')
        }
    })();
})

// GET -> Dashboard
app.get('/dashboard', (req, res) => {
    if (req.cookies.email) {res.render('pages/dashboard', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })} 
    else {res.redirect('/login')}
})

// GET -> Perfil
app.get('/perfil', (req, res) => {
    res.render('pages/perfil', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
})


// PRODUTO --------------------------------------------------------------

// GET -> Produtos
app.get('/produto', (req, res) => {

    (async () => {
        const p = await db.selectProdutos();
        res.render('pages/produto/produtos', { produtos: p, email: req.cookies.email ,gestor: req.cookies.gestor=='true' ? true : false })

    })();

})

// GET -> Produto/Ver
app.get('/produto/ver/:p', (req, res) => {
    (async () => {

        const p = await db.selectProdutoID(req.params.p);

        res.render('pages/produto/verProduto', { produto: p, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
    })();
})

// GET -> Produto/Criar
app.get('/produto/criar', (req, res) => {
    res.render('pages/produto/criarProduto', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
})

// POST -> Produto/Criar
app.post('/produto/criar/post', (req, res) => {
    (async () => {
        let nome = req.body.nome
        let categoria = req.body.categoria
        let preco = req.body.valor
        let estoque = req.body.estoque
        let descricao = req.body.descricao

        await db.insertProduto(nome, categoria, preco, estoque, descricao);

        res.redirect('/produto')
    })();
})

// GET -> Produto/Editar
app.get('/produto/editar/:p', (req, res) => {
    (async () => {

        const p = await db.selectProdutoID(req.params.p);

        res.render('pages/produto/editarProduto', { produto: p, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
    })();
})

// POST -> Produto/Editar
app.post('/produto/editar/post', (req, res) => {
    (async () => {
        let id = req.body.id
        let nome = req.body.nome
        let categoria = req.body.categoria
        let preco = req.body.valor
        let estoque = req.body.estoque
        let descricao = req.body.descricao

        await db.updateProdutoID(id, nome, categoria, preco, estoque, descricao);

        res.redirect('/produto')
    })();
})

// GET -> Produto/Deletar
app.get('/produto/delete/:id', (req, res) => {
    (async () => {
        await db.activeProdutoID(req.params.id, false);
        res.redirect('/produto')
    })();
})

// VENDA --------------------------------------------------------------

// GET -> Vendas
app.get('/venda', (req, res) => {
    (async () => {
        const v = await db.selectVendas();
        res.render('pages/venda/vendas', { vendas: v, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
    })();
})

// GET -> Venda/Criar
app.get('/venda/criar', (req, res) => {
    res.render('pages/venda/criarVenda', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
})

// GET -> Venda/Editar
app.get('/venda/editar', (req, res) => {
    res.render('pages/venda/editarVenda', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
})

// GET -> Venda/Ver
app.get('/venda/ver', (req, res) => {
    res.render('pages/venda/verVenda', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
})

// VENDEDOR --------------------------------------------------------------

// GET -> Vendedor
app.get('/vendedor', (req, res) => {
    (async () => {
        const v = await db.selectVendedores();
        res.render('pages/vendedor/vendedores', { vendedores: v, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
    })();
})

// GET -> Vendedor/Criar
app.get('/vendedor/criar', (req, res) => {
    res.render('pages/vendedor/criarVendedor', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
})

// GET -> Vendedor/Editar
app.get('/vendedor/editar', (req, res) => {
    res.render('pages/vendedor/editarVendedor', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
})

// GET -> Vendedor/Ver
app.get('/vendedor/ver', (req, res) => {
    res.render('pages/vendedor/verVendedor', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
})



// Inicio do Servidor
app.listen(porta, () => {
    console.log('Servidor iniciado com Sucesso. Porta ->', + porta)
})