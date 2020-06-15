var mongoose =require('mongoose');

var{ MONGO_ID, MONGO_PASSWORD, NODE_ENV} = process.env;
var MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;

module.exports = () => {
    var connect = () => {
        if (NODE_ENV !== 'production') {
            mongoose.set('debug',true);
        }
        mongoose.connect(MONGO_URL,{
            dbName:'gifchat',
        },(error) => {
            if(error) {
                console.log('몽고디비 연결 에러', error);
            }else {
                console.log('몽고디비 연결 성공');
            }
        });
    };
    connect();

    mongoose.connection.on('error',(error) => {
        console.error('몽고디비 연결 에러', error);
    });
    mongoose.connection.on('disconnected',() => {
        console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
        connect();
    });

    require('./chat');
    require('./room');
};