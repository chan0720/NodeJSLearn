var expresss = require('express');

var router = express.Router();

reouter.get('/',(req,res) => {

    res.render('index');
});

module.exports = router;