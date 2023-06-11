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
        res.render('pages/produto/produtos', { produtos: p })

    })();

})

app.get('/produto/criar', (req, res) => {
    res.render('pages/produto/criarProduto')
})

app.post('/produto/criar/post', (req, res) => {



    (async () => {
        let nome = req.body.nome
        let preco = req.body.valor
        let estoque = req.body.estoque
        let descricao = req.body.descricao

        //console.log(data.nome)
        console.log(descricao)

        await db.insertProduto(nome, "Categoria A", preco, estoque, descricao);

        //console.log(p);
        res.redirect('/produto')
    })();
})

app.post('/produto/editar/post', (req, res) => {



    (async () => {
        let id = req.body.id
        let nome = req.body.nome
        let preco = req.body.valor
        let estoque = req.body.estoque
        let descricao = req.body.descricao

        //console.log(data.nome)
        console.log(req.body)
        await db.updateProdutoID(id, nome, "Categoria A", preco, estoque, "Teste");

        //console.log(p);
        res.redirect('/produto')
    })();
})

app.get('/produto/delete/:id', (req, res) => {
    (async () => {
        console.log(req.body.preco)
        await db.deleteProdutoID(req.params.id, false);

        //console.log(p);
        res.redirect('/produto')
    })();
})

app.get('/produto/editar/:p', (req, res) => {
    (async () => {
        console.log('Começou!');

        const p = await db.selectProdutoID(req.params.p);

        console.log(p);
        res.render('pages/produto/editarProduto', { produto: p })
    })();
})

app.get('/produto/ver/:p', (req, res) => {
    (async () => {
        console.log('Começou!');

        const p = await db.selectProdutoID(req.params.p);

        console.log(p);
        res.render('pages/produto/verProduto', { produto: p })
    })();
})

// GET -> Venda
app.get('/venda', (req, res) => {
    (async () => {
        console.log('Começou!');

        const v = await db.selectVendas();

        console.log(v);
        res.render('pages/venda/vendas', { vendas: v })
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

        const v = await db.selectVendedores();

        console.log(v);
        res.render('pages/vendedor/vendedores', { vendedores: v })
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