const URL = require('url')
const db = require('../db')



const client = db.connect();




async function handlePOST(req, res) {
    const recurso = URL.parse(req.url, false).pathname;

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
    });

    switch (recurso) {
        case ("/produto/criar"):
            console.log("/produto/criar");
            var data = '';
            var produto;
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                console.log(data)
                p = JSON.parse(data);
                //return writeFile(produto, (message) => res.end(message));
                produto = p;
                //console.log(data)

                (async () => {
                    let nome = produto.nome
                    let categoria = produto.categoria
                    let preco = parseFloat(produto.valor)
                    let estoque = parseFloat(produto.estoque)
                    let descricao = produto.descricao
                    let filename = produto.filename

                    console.log(produto)

                    await db.insertProduto(nome, categoria, preco, estoque, descricao, filename);


                })();
            })

            break;

        case ("/produto/editar"):
            console.log("/produto/editar");
            var data = '';
            var produto;
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                console.log(data)
                p = JSON.parse(data);
                //return writeFile(produto, (message) => res.end(message));
                produto = p;
                //console.log(data)

                (async () => {
                    let nome = produto.nome
                    let categoria = produto.categoria
                    let preco = parseFloat(produto.valor)
                    let estoque = parseFloat(produto.estoque)
                    let descricao = produto.descricao
                    //let filename = produto.filename

                    console.log(produto)

                    //await db.updateProdutoID(nome, categoria, preco, estoque, descricao, filename);


                })();
            })

            break;

    }
}

module.exports = handlePOST;