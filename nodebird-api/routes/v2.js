var express = require('express');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var url= require('url');

var {verifyToken, apiLimiter} = require('./middlewares');
var {Domain, User, Post, Hashtag} = require('../models');
const { UnprocessableEntity } = require('http-errors');

var router = express.Router();

router.use(async(req,res,next) => {
    const domain =await Domain.find({
        where: {host: url.parse(req.get('origin')).host},
    });
    if(domain) {
        cors({ origin: req.get('origin')})(req,res,next);
    }else{
        next();
    }
});

router.post('/token', apiLimiter, async(req, res) =>{
    var{ clientSecret} = req.body;
    try{
        const domain = await Domain.find({
            where: {clientSecret},
            include: {
                model: User,
                attribute:['nick','id'],
            },
        });
        if(!domain) {
            return res.status(401).json({
                code: 401,
                message:'등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
            });
        }
        var token = jwt.sign({
            id: domain.user.id,
            nick: domain.user.nick,
        }, porcess.env.JWT_SECRET,{
            expiresIn:'30m',
            issuer:'nodebird',
        });
        return res.json({
            code: 200,
            message:'토큰이 발급되었습니다.',
            token,
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            code:500,
            message:'서버 에러'
        });
    }
});

router.get('/test', verifyToken, apiLimiter, (req, res)=> {
    res.json(req.decoded);
});

router.get('/posts/my', apiLimiter, verifyToken, (req, res) => {
    Post.findAll({where: {userId: req.decoded.id} })
    .then((posts) => {
        console.log(posts);
        res.json([
            code: 200,
            payload: posts,
        ]);
    })
    .catch((error) => {
        console.error(error);
        return res.status(500).json({
            code:500,
            message:'서버 에러',
        });
    });
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async (resq, res)=> {
    try{
        const hashtag = await Hashtag.find({where:{title: req.params.title}});
        if(!hashtag){
            return res.status(404).json({
                code:404,
                message:'검색 결과가 없습니다.',
            });
        }
        var porsts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code:500,
            message:'서버 에러',
        });
    }
});

module.exports = router;