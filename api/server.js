const http = require('http')

const handleGET = require('./handleGET')
const handlePOST = require('./handlePOST')


http.createServer((req, res) => {
    switch (req.method) {
        case 'GET':
            console.log('method GET');
            handleGET(req, res);
            break;
        case 'POST':
            console.log('method POST');
            handlePOST(req, res);
            break;
        default:
            res.statusCode = '404';
            res.end(JSON.stringify({ message: "Método HTTP Inválido" }));
    }
}).listen(9012, () => console.log(`API está rodando na porta ${9012}`))