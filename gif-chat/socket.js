var SocketIO = require('socket.io');
module.exports = (server) => {
    var io= SocketIO(server, {path:'/socket.io'});


    io.on('connection', (socket) =>{
        var req =socket.request;
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
         socket.on('disconnect',() => {
            console.log('클라이언트 접속 해제',ip, socket.id);
            clearInterval(socket.interval);
        });
        socket.on('error', (error) => {
            console.error(error);
        });
        socket.on('reply',(data) =>{
            console.log(data);
        });
        socket.interval = setInterval(() =>{
            socket.emit('news','Hello socket.IO');
        },3000);
    });
};