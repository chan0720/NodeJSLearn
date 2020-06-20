var express = require('express');

var Room = require('../schemas/room');
var Chat = require('../schemas/chat');
const room = require('../schemas/room');

var router = express.Router();

router.get('/', async(req,res,next) => {
    try{
        var rooms = await Room.find({});
        res.render('main',{rooms, title:'GIF채팅방',error:req.flash('roomError')});
    }catch(error){
        console.error(error);
        next(error);
    }

});
router.get('/room', (req, res) => {
    res.render('room', { title: 'GIF 채팅방 생성' });
  });
router.post('/room', async(req,res,nexty)=>{
    try{
        var room =new Room({
            title: req.body.title,
            max: req.body.max,
            owner: req.session.color,
            password: req.body.password,
        });
        var newRoom = await room.save();
        var io =req.app.get('io');
        io.of('/room').emit('newRoom', newRoom);
        res.redirect(`/room/${newRoom._id}? passsword =${req.body.password}`);
    }catch (error){
        console.error(error);
        next(error);
    }
});
router.get('/room/:id', async(req, res, next) =>  {
    try{
        var room =await Room.findOne({_id: req.params.id});
        var io =req.app.get('io');
        if(!room){
            req.flash('roomError','존재하지 않는 방입니다.');
            return res.redirect('/');
        }
        if(room.password && room.password !== req.query.password) {
            req.flash('roomError','비밀번호가 틀렸습니다.');
            return res.redirect('/');
        }
        var { rooms}= io.of('/chat').adapter;
        if(rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length){
            req.flash('roomError','허용 인원이 초과하였습니다.');
            return res.redirect('/');
        }
        return res.render('chat', {
            room,
            title: room.title,
            chats:[],
            user: req.session.color,
        });
        
    } catch (error){
        console.error(error);
        return next(error);
    }
});

router.delete('/room/:id', async(req, res, next)=> {
    try{
        await Room.remove({ _id: req.params.id});
        await Chat.remove({ room: req.params.id});
        res.send('ok');
        setTimeout(() => {
            req.app.get('io').of('/room').emit('removeRoom', req.params.id);
        }, 2000);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;