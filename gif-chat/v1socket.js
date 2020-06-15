var WebSocket = require('ws');

module.exports = (server) => {
    var wss = new WebSocket.Server({server});
    wss.on('connection', (ws,req) =>{
        console.log('새로운 클라이언트 접속', ip);
        ws.on('message', (message) => {
            console.log(message);
        });
        ws.on('error',(error) => {
            console.error(error);
        });
        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            clearIntervar(ws.interval);
        });
        var interval = setInterval(() =>{
            if(ws.readyState === ws.OPEN) {
                ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
            }
        },3000);
    });
};