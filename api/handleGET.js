const URL = require('url')
const db = require('../db')



async function handleGET(req, res) {
    const recurso = URL.parse(req.url, false).pathname;

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
    });

    switch (recurso) {
        case ("/produto"):
            (async () => {
                const produtos = await db.selectProdutos();
                //console.log(produtos)
                //res.send({ produtos: p, email: req.cookies.email, gestor: req.cookies.gestor == 'true' ? true : false })
                res.end(JSON.stringify(produtos));
            })();
            //return res.end(JSON.stringify({"carro": "10"}));
            
        
    }
}

module.exports = handleGET;