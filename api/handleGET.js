const URL = require('url')
const db = require('../db')

async function handleGET(req, res) {
    const recurso = URL.parse(req.url, false).pathname;

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
    });

    switch (true) {
        // USUARIO
        case (recurso.startsWith("/perfil")):
                (async () => {
                    const partes_url = recurso.split("/");
                    if (partes_url[2] == "gestor"){
                        const p = await db.dadosGestor(partes_url[3])
                        res.end(JSON.stringify(p));
                    }
                    else {
                        const p = await db.dadosUsuario(partes_url[3]);
                        res.end(JSON.stringify(p));
                    }
                })();
                
        break;
        //PRODUTO
        case (recurso.startsWith("/produto")):
            if (recurso == "/produto"){
                (async () => {
                    const p = await db.selectProdutos();
                    res.end(JSON.stringify(p));
                })();
            } 
            else {
                (async () => {
                    const partes_url = recurso.split("/");
                    if (partes_url[2] == "delete"){
                        await db.activeProdutoID(partes_url[3], false)
                    }
                    else {
                        const p = await db.selectProdutoID(partes_url[3]);
                        res.end(JSON.stringify(p));
                    }
                })();
            } 
                
        break;

        // VENDA
        case (recurso.startsWith("/venda")):
            if (recurso == "/venda"){
                (async () => {
                    const v = await db.selectVendas();
                    res.end(JSON.stringify(v));
                })();
            } 
            else {
                (async () => {
                    const partes_url = recurso.split("/");
                    if (partes_url[2] == "delete"){
                        await db.deleteVendaID(partes_url[3])
                    }
                    else if (partes_url[2] == "ver"){
                        const v = await db.selectVendaID(partes_url[3]);
                        res.end(JSON.stringify(v));
                    }
                    else if (partes_url[2] == "produtos"){
                        const pv = await db.selectProdutosVenda(partes_url[3]);
                        res.end(JSON.stringify(pv));
                    }
                    
                })();
            } 

        break;

        // VENDEDOR
        case (recurso.startsWith("/vendedor")):
            if (recurso == "/vendedor"){
                (async () => {
                    const p = await db.selectVendedores();
                    res.end(JSON.stringify(p));
                })();
            } 
            else {
                (async () => {
                    const partes_url = recurso.split("/");
                    if (partes_url[2] == "delete"){
                        await db.activeVendedorID(partes_url[3], false)
                    }
                    else if (partes_url[2] == "ver" || partes_url[2] == "editar"){
                        const v = await db.selectVendedorID(partes_url[3]);
                        console.log(v)
                        res.end(JSON.stringify(v));
                    }
                    else if (partes_url[2] == "vendas"){
                        const vd = await db.selectVendasVendedorID(partes_url[3]);
                        res.end(JSON.stringify(vd));
                    }
                    
                })();
            } 
        break;
        // CLIENTE
        case (recurso.startsWith("/cliente")):
            if (recurso == "/cliente"){
                (async () => {
                    const p = await db.selectClientes();
                    res.end(JSON.stringify(p));
                })();
            } 
            else {
                (async () => {
                    const partes_url = recurso.split("/");
                    if (partes_url[2] == "delete"){
                        console.log("TESTEEEEEEEE", partes_url);
                        await db.activeProdutoID(partes_url[3], false)
                    }
                    else {
                        const p = await db.selectProdutoID(partes_url[3]);
                        res.end(JSON.stringify(p));
                    }
                })();
            } 
        break;
    }
}

module.exports = handleGET;