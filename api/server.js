const http = require('http')

const handleget = require('./handleGET')


http.createServer((req, res) => {
    switch (req.method) {
        case 'GET':
            console.log('method GET');
            return handleget(req, res);
        case 'POST':
            console.log('method POST');
        default:
            res.statusCode = '404';
            res.end(JSON.stringify({ message: "Método HTTP Inválido" }));
    }
}).listen(9012, () => console.log(`API está rodando na porta ${9012}`))