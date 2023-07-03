const URL = require('url')
const db = require('../db')

async function handlePOST(req, res) {
    const recurso = URL.parse(req.url, false).pathname;

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
    });

    switch (true) {

        // USUARIO -----------------------------------------
        case (recurso.startsWith("/perfil/vendedor")):
            console.log("/perfil/vendedor");
            var data = '';
            var usuario;
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                console.log(data)
                p = JSON.parse(data);
                usuario = p;

                (async () => {
                    let id = usuario.id
                    let email = usuario.email
                    let novo_email = usuario.novo_email
                    let nome = usuario.nome
                    let senha = usuario.senha
                    let telefone = usuario.telefone
                    let endereco = usuario.endereco

                    let filename
                    if ('filename' in usuario) {
                        filename = usuario.filename 
                    }
                    else {
                        let usuario = await db.selectVendedorID(id)
                        filename = usuario[0].filename;
                    }
                    console.log(filename)

                    await db.updateUsuario(email, nome, novo_email, senha, telefone, endereco, filename);
                })();
            })
        break;

        case (recurso.startsWith("/perfil/gestor")):
            console.log("/perfil/gestor");
            var data = '';
            var usuario;
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                console.log(data)
                p = JSON.parse(data);
                usuario = p;

                (async () => {
                    let email = usuario.email
                    let novo_email = usuario.novo_email
                    let senha = usuario.senha

                    await db.updateGestor(email, novo_email, senha)
                })();
            })
        break;

        // PRODUTO -----------------------------------------
        case (recurso == "/produto/criar"):
            console.log("/produto/criar");
            var data = '';
            var produto;
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                console.log(data)
                p = JSON.parse(data);
                produto = p;

                (async () => {
                    let nome = produto.nome
                    let categoria = produto.categoria
                    let preco = parseFloat(produto.valor)
                    let estoque = parseFloat(produto.estoque)
                    let descricao = produto.descricao
                    let filename = produto.filename

                    console.log("AQUIIIIIIII", produto, produto.filename)

                    await db.insertProduto(nome, categoria, preco, estoque, descricao, filename);


                })();
            })

            break;

        case (recurso.startsWith("/produto/editar")):
            console.log("/produto/editar");
            var data = '';
            var produto;
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                console.log(data)
                p = JSON.parse(data);
                produto = p;

                (async () => {
                    let id = produto.id
                    let nome = produto.nome
                    let categoria = produto.categoria
                    let preco = parseFloat(produto.valor)
                    let estoque = parseFloat(produto.estoque)
                    let descricao = produto.descricao

                    let filename
                    if ('filename' in produto) {
                        filename = produto.filename 
                    }
                    else {
                        let produto = await db.selectProdutoID(id);
                        filename = produto[0].filename;
                    }

                    await db.updateProdutoID(id, nome, categoria, preco, estoque, descricao, filename);
                })();
            })
            break;
        
            // VENDA -----------------------------------------
            case (recurso == "/venda/criar"):
            console.log("/venda/criar");
            var data = '';
            var venda;
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                p = JSON.parse(data);
                venda = p;

                (async () => {
                    let vendedor = venda.vendedor
                    let cliente = venda.cliente
                    let produtos = venda.produto_venda;
                    typeof(produtos) == 'string' ? produtos = [parseInt(produtos)] : undefined;
                    let quantidades = venda.quantidade;
                    typeof(quantidades) == 'string' ? quantidades = [parseInt(quantidades)] : undefined;

                    id_venda = await db.insertVenda(vendedor, cliente);
                    res.end(JSON.stringify(id_venda));

                    let contador = 0;
                    produtos.forEach(produto => {
                        db.insertProdutoVenda(id_venda[0].id, produto, quantidades[contador]);
                        contador++;
                    });

                })();
            })

            break;

            // VENDEDOR ------------------------------------
            case (recurso == "/vendedor/criar"):
            console.log("/vendedor/criar");
            var data = '';
            var vendedor;
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                console.log(data)
                p = JSON.parse(data);
                vendedor = p;

                (async () => {
                    let nome = vendedor.nome
                    let email = vendedor.email
                    let telefone = vendedor.telefone
                    let endereco = vendedor.endereco
                    let meta = parseFloat(vendedor.meta)
                    let filename = vendedor.filename
                    console.log("AQUIIIIII", vendedor, vendedor.filename)

                    await db.insertVendedor(nome, email, telefone, endereco, meta, 0, filename)


                })();
            })

            break;

            case (recurso.startsWith("/vendedor/editar")):
                console.log("/vendedor/editar");
                var data = '';
                var vendedor;
                req.on('data', chunk => {
                    data += chunk;
                });
                req.on('end', () => {
                    console.log(data)
                    p = JSON.parse(data);
                    vendedor = p;

                    (async () => {
                        let id = vendedor.id
                        let meta = parseFloat(vendedor.meta)
                        let meta_atual = parseFloat(vendedor.meta_atual)

                        await db.updateMetaVendedorID(id, meta, meta_atual);
                    })();
                })
            break;

            // USUARIO
            case (recurso == "/login"):
                var data = '';
                var login;
                req.on('data', chunk => {
                    data += chunk;
                });
                req.on('end', () => {
                    console.log(data)
                    p = JSON.parse(data);
                    login = p;

                    (async () => {
                        let email = login.email
                        let senha = login.senha

                        v = await db.validarUsuario(email, senha);
                        console.log(v);
                        res.end(JSON.stringify(v));
                    })();
                })
            break;
            

    }
}

module.exports = handlePOST;