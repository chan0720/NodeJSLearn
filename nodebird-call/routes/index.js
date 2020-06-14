var express = require('express');
var axios = require('axios');

var router = express.Router();


/* GET home page. */
router.get('/', async(req, res, next) => {
  try {
    if(!req.session.jwt) {
      const tokenResult =  await axios.post('http://localhost:8002/v1/token',{
        clientSecret: process.env.CLIENT_SECRET,
      });
      if(tokenResult.data && tokenResult.data && tokenResult.data.code ===200){
        req.session.jwt = tokenResult.data.token;
      }else{
        return res.json(tokenResult.data);
      }
    }
    cosnt result = await axios.get('http://localhost:8002/v1/test', {
      headers: { authorization:req.session.jwt},
    });
    return res.jsonj(result.data);
  } catch(error) {
    console.error(error);
    if(error.response.status ===419) {
      return res.json(error.response.data);
    }
    return next(error);
  }
});

module.exports = router;
