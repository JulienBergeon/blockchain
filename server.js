const net = require('net')
const server = net.createServer((socket) => {
    socket.on('data',(data) => {
        console.log(data.toString());
    });
    socket.write('SERVEUR: Hello! Je suis le serveur');
    socket.end('SERVEUR: Fin de la connexion');
}).on('error', (err) => {
    console.error(err);
});
server.listen(9898, () => {
    console.log('Connexion au port ', server.address().port);
});