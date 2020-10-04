var express =  require('express');
var Arouter = express.Router();
Arouter.get('/dangxuat',function(req,res){
    delete req.session.user;
    delete req.session.pws ;
    res.redirect('/')
})
module.exports = Arouter;