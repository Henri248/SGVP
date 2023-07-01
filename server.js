const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const { type } = require('express/lib/response');



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
            res.redirect('/produto')
        } else {
            res.redirect('/login')
        }
    })();
})

// GET -> Dashboard
app.get('/dashboard', (req, res) => {
    if (req.cookies.email) { res.render('pages/dashboard', { email: req.cookies.email, gestor: req.cookies.gestor == 'true' ? true : false }) }
    else { res.redirect('/login') }
})

// GET -> Perfil
app.get('/perfil', (req, res) => {
    if (req.cookies.email) {
        if (req.cookies.gestor == 'true') {
            (async () => {
                const u = await db.dadosGestor(req.cookies.email);
                res.render('pages/perfilGestor', {usuario: u, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
            })();
        }
        else {
            (async () => {
                const u = await db.dadosUsuario(req.cookies.email);
                const vd = await db.selectVendasVendedorID(u[0].id);
                res.render('pages/perfil', {usuario: u, vendas: vd, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
            })();
        }
    } else {res.send('ACESSO NEGADO!')}
})

// POST -> Perfil
app.post('/perfil/post', (req, res) => {
    if (req.cookies.email) {
        if (req.cookies.gestor == 'true') {
            (async () => {
                let email = req.cookies.email
                let novo_email = req.body.email
                let senha = req.body.senha

                await db.updateGestor(email, novo_email, senha);
                res.cookie('email', novo_email)
                res.redirect('/perfil')
                })();
        }
        else {
            (async () => {
                let email = req.cookies.email
                let novo_email = req.body.email
                let senha = req.body.senha
                let nome = req.body.nome
                let telefone = req.body.telefone
                let endereco = req.body.endereco
        
                await db.updateUsuario(email, nome, novo_email, senha, telefone, endereco);
                res.cookie('email', novo_email)
                res.redirect('/perfil')
                })();
        }
    } else {res.send('ACESSO NEGADO!')}

})


// PRODUTO --------------------------------------------------------------

// GET -> Produtos
app.get('/produtos', (req, res) => {

    (async () => {
        const p = await db.selectProdutos();
        //console.log(p)
        res.send({ produtos: p, email: req.cookies.email, gestor: req.cookies.gestor == 'true' ? true : false })
    })();
    //res.render('pages/produto/produtos', { produtos: pa, email: req.cookies.email ,gestor: req.cookies.gestor=='true' ? true : false })
})

app.get('/produto', (req, res) => {

    res.render('pages/produto/produtos', { email: req.cookies.email, gestor: req.cookies.gestor == 'true' ? true : false })
})


// GET -> Produto/Ver
app.get('/produto/ver/:p', (req, res) => {
    (async () => {

        const p = await db.selectProdutoID(req.params.p);

        res.render('pages/produto/verProduto', { produto: p, email: req.cookies.email, gestor: req.cookies.gestor == 'true' ? true : false })
    })();
})

// GET -> Produto/Criar
app.get('/produto/criar', (req, res) => {
    if (req.cookies.gestor == 'true') {res.render('pages/produto/criarProduto', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })}
    else {res.send('ACESSO NEGADO!')}

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
    } else {res.send('ACESSO NEGADO!')}
})

// GET -> Produto/Editar
app.get('/produto/editar/:p', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {

        const p = await db.selectProdutoID(req.params.p);

        res.render('pages/produto/editarProduto', { produto: p, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
        })();
    } else {res.send('ACESSO NEGADO!')}

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
    } else {res.send('ACESSO NEGADO!')}
})

// GET -> Produto/Deletar
app.get('/produto/delete/:id', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
        await db.activeProdutoID(req.params.id, false);
        res.redirect('/produto')
        })();
    } else {res.send('ACESSO NEGADO!')}
})

// VENDA --------------------------------------------------------------

// GET -> Vendas
app.get('/venda', (req, res) => {
    (async () => {
        const v = await db.selectVendas();
        res.render('pages/venda/vendas', { vendas: v, email: req.cookies.email, gestor: req.cookies.gestor == 'true' ? true : false })
    })();
})

// GET -> Venda/Ver
app.get('/venda/ver/:v', (req, res) => {
    (async () => {

        const v = await db.selectVendaID(req.params.v);
        const pv = await db.selectProdutosVenda(req.params.v);

        res.render('pages/venda/verVenda', { venda: v, produtos_venda: pv, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
    })();
})

// GET -> Venda/Criar (implementar)
app.get('/venda/criar', (req, res) => {
    if (req.cookies.email) {(async () => {
        const v = await db.selectVendedores();
        const c = await db.selectClientes();
        const p = await db.selectProdutos();
        res.render('pages/venda/criarVenda', { vendedores: v, clientes: c, produtos: p, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
        })();
    } else {res.send('ACESSO NEGADO!')}

})

// POST -> Venda/Criar
app.post('/Venda/criar/post', (req, res) => {
    if (req.cookies.email) {
        (async () => {
        let vendedor = req.body.vendedor;
        let cliente = req.body.cliente;
        let produtos = req.body.produto_venda;
        typeof(produtos) == 'string' ? produtos = [parseInt(produtos)] : undefined;
        let quantidades = req.body.quantidade;
        typeof(quantidades) == 'string' ? quantidades = [parseInt(quantidades)] : undefined;
        
        venda = await db.insertVenda(vendedor, cliente);
        
        let contador = 0;
        produtos.forEach(produto => {
            db.insertProdutoVenda(venda[0].id, produto, quantidades[contador]);
            contador++
        });

        
        
        res.redirect('/venda')
        })();
    } else {res.send('ACESSO NEGADO!')}
})

// GET -> Venda/Deletar
app.get('/venda/delete/:id', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
        await db.deleteVendaID(req.params.id);
        res.redirect('/venda')
        })();
    } else {res.send('ACESSO NEGADO!')}
})

// VENDEDOR --------------------------------------------------------------

// GET -> Vendedor
app.get('/vendedor', (req, res) => {
    if (req.cookies.gestor == 'true') {(async () => {
        const v = await db.selectVendedores();
        res.render('pages/vendedor/vendedores', { vendedores: v, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
        })();
    } else {res.send('ACESSO NEGADO!')}

})

// GET -> Vendedor/Ver
app.get('/vendedor/ver/:v', (req, res) => {
    (async () => {

        const v = await db.selectVendedorID(req.params.v);
        const vd = await db.selectVendasVendedorID(req.params.v);

        res.render('pages/vendedor/verVendedor', { vendedor: v, vendas: vd, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
    })();
})

// GET -> Vendedor/Criar
app.get('/vendedor/criar', (req, res) => {
    if (req.cookies.gestor == 'true') {res.render('pages/vendedor/criarVendedor', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })}
    else {res.send('ACESSO NEGADO!')}
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
    } else {res.send('ACESSO NEGADO!')}
})

// GET -> Vendedor/Editar
app.get('/vendedor/editar/:v', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
            const v = await db.selectVendedorID(req.params.v);
            res.render('pages/vendedor/editarVendedor', {vendedor: v, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
        })();
    } else {res.send('ACESSO NEGADO!')}
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
    } else {res.send('ACESSO NEGADO!')}
})

// GET -> Vendedor/Deletar
app.get('/vendedor/delete/:id', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
        await db.activeVendedorID(req.params.id, false);
        res.redirect('/vendedor')
        })();
    } else {res.send('ACESSO NEGADO!')}
})






// Inicio do Servidor
app.listen(porta, () => {
    console.log('Servidor iniciado com Sucesso. Porta ->', + porta)
})