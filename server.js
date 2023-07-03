///////////////////////////////////  CONFIGURAÇÃO DO APP  ///////////////////////////////////

const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts')
const fs = require('fs')
const { type } = require('express/lib/response');



const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(cookieParser())
app.use(expressLayouts)
app.set('view engine', 'ejs')


const porta = 8000;
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/produtos')
    },
    filename: function (req, file, cb) {
        mimetype = file.mimetype;
        tipo = '';
        if (mimetype == 'image/jpeg') {
            tipo = '.jpeg';
        } else if (mimetype == 'image/png') {
            tipo = '.png';
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + tipo)
    }
})

const upload = multer({ storage: storage })


// Funções ------------------------------------------

async function fetchGet(url) {
    return await fetch(url)
        .then(response => response.json())
        .catch(err => console.log(err));
}

async function fetchPost(url, req, res) {
    
    return await fetch(url, {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: { "Content-type": "application/json" }
      }).then(response => response.json())
        .catch(err => console.log(err));;
    
}
  

//////////////////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    (async () => {
        await fetch("http://localhost:9012/produtos")
            .then(response => {
                response.json().then((data) => {

                    produtos = data.produtos;
                    console.log(data)
                });
            }).catch(err => {
                console.error('Failed retrieving information', err);
            });
    })();
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
    console.log(req.body);
    (async () => {
        const login = await fetchPost("http://localhost:9012/login", req, res)
        console.log("TESTEEEEE", login)
        
        console.log(login)
        if (login[0]) {
            res.cookie('email', req.body.email);
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
                const u = await fetchGet(`http://localhost:9012/perfil/gestor/${req.cookies.email}`);
                res.render('pages/perfilGestor', {usuario: u, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
            })();
        }
        else {
            (async () => {
                const u = await fetchGet(`http://localhost:9012/perfil/vendedor/${req.cookies.email}`);
                console.log("TESTANDODODODODODO", u, req.cookies.email)
                const vd = await fetchGet(`http://localhost:9012/vendedor/vendas/${u[0].id}`);
                res.render('pages/perfil', {usuario: u, vendas: vd, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
            })();
        }
    } else {res.send('ACESSO NEGADO!')}
})

// POST -> Perfil (VENDEDOR)
app.post('/perfil/vendedor', upload.single('imagem'), (req, res) => {
    if (req.cookies.email) {
        
        (async () => {
        if('file' in req) {req.body.filename = req.file.filename;}
        req.body.novo_email = req.body.email
        req.body.email = req.cookies.email

        await fetchPost(`http://localhost:9012/perfil/vendedor/${req.cookies.email}`, req, res)
            .then(res.cookie('email', req.body.novo_email))
            .then(res.redirect('/produto'))
            .catch(res.render('Erro ao editar o Perfil'))
        })();

    } else {res.send('ACESSO NEGADO!')}

})

// POST -> Perfil (GESTOR)
app.post('/perfil/gestor', (req, res) => {
    if (req.cookies.gestor == 'true') {
        
        (async () => {
        req.body.novo_email = req.body.email
        req.body.email = req.cookies.email

        await fetchPost(`http://localhost:9012/perfil/gestor/${req.cookies.email}`, req, res)
            .then(res.cookie('email', req.body.novo_email))
            .then(res.redirect('/produto'))
            .catch(res.render('Erro ao editar o Perfil'))
        })();

    } else {res.send('ACESSO NEGADO!')}

})


// PRODUTO --------------------------------------------------------------

// GET -> /produto
app.get('/produto', (req, res) => {

    (async () => {
        const p = await fetchGet('http://localhost:9012/produto');

        res.render('pages/produto/produtos', { produtos: p, email: req.cookies.email, gestor: req.cookies.gestor == 'true' ? true : false })
        
    })();

})


// GET -> Produto/Ver
app.get('/produto/ver/:p', (req, res) => {
    (async () => {

        const p = await fetchGet(`http://localhost:9012/produto/ver/${req.params.p}`);

        res.render('pages/produto/verProduto', { produto: p, email: req.cookies.email, gestor: req.cookies.gestor == 'true' ? true : false })
    })();
})

// GET -> Produto/Criar
app.get('/produto/criar', (req, res) => {

    if (req.cookies.gestor == 'true') {res.render('pages/produto/criarProduto', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })}
    else {res.send('ACESSO NEGADO!')}
})


// POST -> Produto/Criar
app.post('/produto/criar', upload.single('imagem'), (req, res) => {
    if (req.cookies.gestor == 'true') {

        if('file' in req) {req.body.filename = req.file.filename;}

        fetchPost("http://localhost:9012/produto/criar", req, res)
            .then(res.redirect('/produto'))
            .catch(res.render('Erro ao criar o Produto'))

    } else {res.send('ACESSO NEGADO!')}

})

// GET -> Produto/Editar
app.get('/produto/editar/:p', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {

            const p = await fetchGet(`http://localhost:9012/produto/editar/${req.params.p}`);

            res.render('pages/produto/editarProduto', { produto: p, email: req.cookies.email, gestor: req.cookies.gestor == 'true' ? true : false })
        })();

    } else {res.send('ACESSO NEGADO!')}
})

// POST -> Produto/Editar
app.post('/produto/editar', upload.single('imagem'), (req, res) => {
    if (req.cookies.gestor == 'true') {
        
        if('file' in req) {req.body.filename = req.file.filename;}

        fetchPost(`http://localhost:9012/produto/editar/${req.body.id}`, req, res)
            .then(res.redirect('/produto'))
            .catch(res.render('Erro ao editar o Produto'))


    } else {res.send('ACESSO NEGADO!')}
})

// GET -> Produto/Deletar
app.get('/produto/delete/:id', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
            fetchGet(`http://localhost:9012/produto/delete/${req.params.id}`)
        
            res.redirect('/produto')
        })();

    } else {res.send('ACESSO NEGADO!')}
})

// VENDA --------------------------------------------------------------

// GET -> Vendas
app.get('/venda', (req, res) => {
    (async () => {
        const v = await fetchGet('http://localhost:9012/venda')
        res.render('pages/venda/vendas', { vendas: v, email: req.cookies.email, gestor: req.cookies.gestor == 'true' ? true : false })
    })();
})

// GET -> Venda/Ver
app.get('/venda/ver/:v', (req, res) => {
    (async () => {

        const v = await fetchGet(`http://localhost:9012/venda/ver/${req.params.v}`);
        const pv = await fetchGet(`http://localhost:9012/venda/produtos/${req.params.v}`);

        res.render('pages/venda/verVenda', { venda: v, produtos_venda: pv, email: req.cookies.email, gestor: req.cookies.gestor == 'true' ? true : false })
    })();
})

// GET -> Venda/Criar 
app.get('/venda/criar', (req, res) => {

    if (req.cookies.email) {(async () => {
        const v = await fetchGet(`http://localhost:9012/vendedor`);
        const c = await fetchGet(`http://localhost:9012/cliente`);
        const p = await fetchGet(`http://localhost:9012/produto`);
        res.render('pages/venda/criarVenda', { vendedores: v, clientes: c, produtos: p, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
        })();
    } else {res.send('ACESSO NEGADO!')}

})

// POST -> Venda/Criar
app.post('/Venda/criar/post', (req, res) => {
    if (req.cookies.email) {
        (async () => {
        let produtos = req.body.produto_venda;
        typeof(produtos) == 'string' ? produtos = [parseInt(produtos)] : undefined;
        let quantidades = req.body.quantidade;
        typeof(quantidades) == 'string' ? quantidades = [parseInt(quantidades)] : undefined;
        
        venda = await fetchPost("http://localhost:9012/venda/criar", req, res)
                            .then(res.redirect('/venda'))
                            .catch(res.render('Erro ao criar a Venda'))
        })();
    } else {res.send('ACESSO NEGADO!')}
})

// GET -> Venda/Deletar
app.get('/venda/delete/:id', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
            fetchGet(`http://localhost:9012/venda/delete/${req.params.id}`)
            res.redirect('/venda')
        })();

    } else {res.send('ACESSO NEGADO!')}
})

// VENDEDOR --------------------------------------------------------------

// GET -> Vendedor
app.get('/vendedor', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
            const v = await fetchGet(`http://localhost:9012/vendedor`);
            res.render('pages/vendedor/vendedores', { vendedores: v, email: req.cookies.email, gestor: req.cookies.gestor == 'true' ? true : false })
        })();

    } else {res.send('ACESSO NEGADO!')}

})

// GET -> Vendedor/Ver
app.get('/vendedor/ver/:v', (req, res) => {
    (async () => {

        const v = await fetchGet(`http://localhost:9012/vendedor/ver/${req.params.v}`);
        const vd = await fetchGet(`http://localhost:9012/vendedor/vendas/${req.params.v}`);


        res.render('pages/vendedor/verVendedor', { vendedor: v, vendas: vd, email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })
    })();
})

// GET -> Vendedor/Criar
app.get('/vendedor/criar', (req, res) => {

    if (req.cookies.gestor == 'true') {res.render('pages/vendedor/criarVendedor', { email: req.cookies.email, gestor: req.cookies.gestor=='true' ? true : false })}
    else {res.send('ACESSO NEGADO!')}
})

// POST -> Vendedor/Criar
app.post('/vendedor/criar', upload.single('imagem'), (req, res) => {
    if (req.cookies.gestor == 'true') {
       

            if('file' in req) {req.body.filename = req.file.filename;}

            fetchPost("http://localhost:9012/vendedor/criar", req, res)
            .then(res.redirect('/vendedor'))
            .catch(res.render('Erro ao criar o Vendedor'))
            
            res.redirect('/vendedor')

            

    } else {res.send('ACESSO NEGADO!')}
})

// GET -> Vendedor/Editar
app.get('/vendedor/editar/:v', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
            const v = await fetchGet(`http://localhost:9012/vendedor/editar/${req.params.v}`);

            res.render('pages/vendedor/editarVendedor', { vendedor: v, email: req.cookies.email, gestor: req.cookies.gestor == 'true' ? true : false })
        })();

    } else {res.send('ACESSO NEGADO!')}
})

// POST -> Vendedor/Editar
app.post('/vendedor/editar', (req, res) => {
    if (req.cookies.gestor == 'true') {
        (async () => {
            fetchPost(`http://localhost:9012/vendedor/editar/${req.body.id}`, req, res)
            .then(res.redirect('/vendedor'))
            .catch(res.render('Erro ao editar o vendedor'))
        })();

    } else {res.send('ACESSO NEGADO!')}
})

// GET -> Vendedor/Deletar
app.get('/vendedor/delete/:id', (req, res) => {
    if (req.cookies.gestor == 'true') {
            
        fetchGet(`http://localhost:9012/vendedor/delete/${req.params.id}`)
        res.redirect('/vendedor')

    } else {res.send('ACESSO NEGADO!')}
})

// GET -> Vendedor/resetar
app.get('/vendedor/resetar', (req, res) => {
    if (req.cookies.gestor == 'true') {
            
        fetchGet(`http://localhost:9012/vendedor/resetar`)
        res.redirect('/vendedor')

    } else {res.send('ACESSO NEGADO!')}
})

// Inicio do Servidor
app.listen(porta, () => {
    console.log('Servidor iniciado com Sucesso. Porta ->', + porta)
})