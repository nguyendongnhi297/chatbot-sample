module.exports.index = function(request,response){
    response.render('./dangnhapad');
};
module.exports.trangchu = function(request,response){
    response.render('./trangchuad');
};
module.exports.lophocnchad = function(request,response){
    response.render('./lophocnchad');
};
module.exports.sualop = function(request,response){
    response.render('./sualop');
}

