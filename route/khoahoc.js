var express = require('express');
var router = express.Router();
var connection = require('./db');



router.get('/', function(request, response, next) {
    if(request.session.loggedin) {
    connection.query('SELECT * FROM khoahoc ORDER BY id desc',function(err,rows)     {

        if(err) {
            request.flash('error', err);
            response.render('lophoc',{data:''});
        } else {
            for(var i = 0 ; i < rows.length;i++){
                x = rows[i].ngayhoc_id;
                switch (x){
                    case 1 : rows[i].ngayhoc_id = "Sáng"; break;
                    case 2 : rows[i].ngayhoc_id = "Trưa"; break;
                    case 3 : rows[i].ngayhoc_id = "Chiều"; break;
                }
                y = rows[i].kinang_id;
                switch (y){
                    case 1 : rows[i].kinang_id = "Gentle Yoga"; break;
                    case 2 : rows[i].kinang_id = "Dynamic Yoga"; break;
                    case 3 : rows[i].kinang_id = "High Fly"; break;
                    case 4 : rows[i].kinang_id = "Yoga Twist"; break;
                }   
                z = rows[i].dotuoi_id;
                switch (z){
                    case 1 : rows[i].dotuoi_id = "6 - 12 Tuổi"; break;
                    case 2 : rows[i].dotuoi_id = "12 - 45 Tuổi"; break;
                    case 3 : rows[i].dotuoi_id = "Trên 45 Tuổi"; break;
                }
                      
                       
            }    
                response.render('lophoc',{data:rows});
        }
    });
    } else{
        response.send('Please login to view this page!');
    }

});

module.exports = router;