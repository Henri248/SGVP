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
    if (req.cookies.email) {res.render('pages/perfil', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })}
    else {res.redirect('/login')}
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
    if (req.cookies.gestor == 'true') {res.render('pages/produto/criarProduto', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })}
    else {res.render('ACESSO NEGADO!')}
})

// POST -> Produto/Criar
app.post('/produto/criar/post', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
        let nome = req.body.nome
        let categoria = req.body.categoria
        let preco = req.body.valor
        let estoque = req.body.estoque
        let descricao = req.body.descricao

        await db.insertProduto(nome, categoria, preco, estoque, descricao);

        res.redirect('/produto')
        })();
    } else {res.render('ACESSO NEGADO!')}
})

// GET -> Produto/Editar
app.get('/produto/editar/:p', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {

        const p = await db.selectProdutoID(req.params.p);

        res.render('pages/produto/editarProduto', { produto: p, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
        })();
    } else {res.render('ACESSO NEGADO!')}
})

// POST -> Produto/Editar
app.post('/produto/editar/post', (req, res) => {
    if (req.cookies.gestor == 'true') {
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
    } else {res.render('ACESSO NEGADO!')}
})

// GET -> Produto/Deletar
app.get('/produto/delete/:id', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
        await db.activeProdutoID(req.params.id, false);
        res.redirect('/produto')
        })();
    } else {res.render('ACESSO NEGADO!')}
})

// VENDA --------------------------------------------------------------

// GET -> Vendas
app.get('/venda', (req, res) => {
    (async () => {
        const v = await db.selectVendas();
        res.render('pages/venda/vendas', { vendas: v, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
    })();
})

// GET -> Venda/Ver
app.get('/venda/ver/:v', (req, res) => {
    (async () => {

        const v = await db.selectVendaID(req.params.v);
        console.log(v)
        const pv = await db.selectProdutosVenda(req.params.v);
        console.log(pv)

        res.render('pages/venda/verVenda', { venda: v, produtos_venda: pv, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
    })();
})

// GET -> Venda/Criar (implementar)
app.get('/venda/criar', (req, res) => {
    if (req.cookies.gestor == 'true') {res.render('pages/venda/criarVenda', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })}
    else {res.render('ACESSO NEGADO!')}
})

// GET -> Venda/Ver
app.get('/venda/ver', (req, res) => {
    if (req.cookies.email) {res.render('pages/venda/verVenda', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })}
    else {res.render('ACESSO NEGADO!')}
})

// VENDEDOR --------------------------------------------------------------

// GET -> Vendedor
app.get('/vendedor', (req, res) => {
    if (req.cookies.gestor == 'true') {(async () => {
        const v = await db.selectVendedores();
        res.render('pages/vendedor/vendedores', { vendedores: v, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
        })();
    } else {res.render('ACESSO NEGADO!')}
})

// GET -> Vendedor/Ver
app.get('/vendedor/ver/:v', (req, res) => {
    (async () => {

        const v = await db.selectVendedorID(req.params.v);

        res.render('pages/vendedor/verVendedor', { vendedor: v, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
    })();
})

// GET -> Vendedor/Criar
app.get('/vendedor/criar', (req, res) => {
    if (req.cookies.gestor == 'true') {res.render('pages/vendedor/criarVendedor', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })}
    else {res.render('ACESSO NEGADO!')}
})

// POST -> Vendedor/Criar
app.post('/vendedor/criar/post', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
        let nome = req.body.nome
        let email = req.body.email
        let telefone = req.body.telefone
        let endereco = req.body.endereco
        let meta = req.body.meta

        await db.insertVendedor(nome, email, telefone, endereco, meta, 0);

        res.redirect('/vendedor')
        })();
    } else {res.render('ACESSO NEGADO!')}
})

// GET -> Vendedor/Editar
app.get('/vendedor/editar/:v', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
            const v = await db.selectVendedorID(req.params.v);
            res.render('pages/vendedor/editarVendedor', {vendedor: v, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
        })();
    } else {res.render('ACESSO NEGADO!')}
})

// POST -> Vendedor/Editar
app.post('/vendedor/editar/post', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
        let id = req.body.id
        let meta = req.body.meta
        let meta_atual = req.body.meta_atual

        await db.updateMetaVendedorID(id, meta, meta_atual);

        res.redirect('/vendedor')
        })();
    } else {res.render('ACESSO NEGADO!')}
})

// GET -> Vendedor/Deletar
app.get('/vendedor/delete/:id', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
        await db.activeVendedorID(req.params.id, false);
        res.redirect('/vendedor')
        })();
    } else {res.render('ACESSO NEGADO!')}
})






// Inicio do Servidor
app.listen(porta, () => {
    console.log('Servidor iniciado com Sucesso. Porta ->', + porta)
})