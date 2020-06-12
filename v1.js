const express =  require('express');
const jwt = require('jsonwebtoken');

const { verifyToken} = require('./middlewares');
const { Domain, USer, Post, Hashtag} = require('../models');

const router =express.Router();

router.post('/token', async(req, res) => {
    const { clientSecret } =req.body;
    try{
        const domain = await Domain.find({
            where: {clientSecret},
            include: {
                model: USer,
                attribute: ['nick','id'],
            },
        });
        if(!domain){
            return res.status(401).json({
                code: 401,
                message:'등록되지 않으 도메인입니다. 먼저 도메인을 등록하세요',
            });
        }
        const token = jwt.sign({
            id: domain.user.id,
            nick: domain.user.nick,
        }, process.env.JWT_SECRET,{
            expiresIn:'1m', //1분
            issuer:'nodebird',
        });
        return res.json({
            code: 200,
            message:'토큰이 발급되었습니다.',
            token,
        });
    }catch(error) {
        console.error(error);
        retrun res.status(500).json({
            code: 500,
            message:'서버 에러',
        });
    }
});

module.exports = router;