var SocketIO= require('socket.io');
var axios = require('axios');

module.exports = (server,app, sessionMiddleware) =>{
    var io = SocketIO(server { path:'/socket.io'});
    app.set('io',io);
    var room = io.of('/room');
    var chat = io.of('/chat');
    room.on('connection',(socket) =>{
        console.log('room 네임스페이스에 접속');
        socket.on('disconnect',()=>{
            console.log('room 네임스페이스 접속 해제');
        });
    });
    chat.on('connection',(socket)=>{
        console.log('chat 네임스페이스에 접속');
        var req = socket.request;
        var {headers: {referer}} =req;
        var roomId = referer
        .split('/')[referer.split('/').length-1]
        .replace(/\?.+/,'');
        socket.join(roomId);
        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');
            socket.leave(roomId);
        });
    });
}