var SocketIO= require('socket.io');
var axios = require('axios');

module.exports = (server,app, sessionMiddleware) =>{
    var io = SocketIO(server, { path:'/socket.io'});
    app.set('io',io);
    var room = io.of('/room');
    var chat = io.of('/chat');
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    room.on('connection',(socket) =>{
        console.log('room 네임스페이스에 접속');
        socket.on('disconnect',()=>{
            console.log('room 네임스페이스 접속 해제');
        });
    });
    chat.on('connection',(socket)=>{
        console.log('chat 네임스페이스에 접속');c
        var req = socket.request;
        var {headers: {referer}} =req;
        var roomId = referer
        .split('/')[referer.split('/').length-1]
        .replace(/\?.+/,'');
        socket.join(roomId);
        socket.to(roomId).emit('join', {
            user:'system',
            chat:`${req.session.color}님이 입장하셧습니다.`,
        });
        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');
            socket.leave(roomId);
            var currentRoom = socket.adapter.rooms[roomId];
            var userCount= currentRoom? currentRoom.length: 0;
            if (userCount ===0) {
                axios.delete(`http://localhost:8005/room/${roomId}`)
                .then(() => {
                    console.log('방 제거 요청 성공');
                })
                .catch((error) =>{
                    console.error(error);
                });
            }else{
                socket.to(roomId).emit('exit',{
                    user:'system',
                    chat: '${req.session.color}님이 퇴장하셔습니다.',
                });
            }
        });
    });
}