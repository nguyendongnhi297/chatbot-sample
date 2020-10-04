var request = require("express");

module.exports.index = function(request,response){
    response.render('./dangnhap'); 
};
module.exports.trangchu = function(request,response){
    response.render('./trangchu');
};
module.exports.nchoc = function(request,response){
    response.render('./nhucauhoc');
};

