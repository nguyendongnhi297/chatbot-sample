var express = require('express');
var Arouter = express.Router();
var controller = require('../controller/admin.controller');
var connection = require('./db');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var md5 = require('md5');
var session = require('express-session');
Arouter.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
Arouter.get('/',controller.index);
Arouter.get('/sualop',controller.sualop);
Arouter.get('/trangchuad', function(request, response) {
	if (request.session.loggedin) {
        response.render('./trangchuad');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


Arouter.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: true });
Arouter.use(upload.array());
//add new user
Arouter.post('/addad',urlencodedParser, function(request,response,next){
    const name = request.body.fullname;
    const taikhoan = request.body.uname;
    const diachi = request.body.address;
    const matkhau = md5(request.body.psw1);
	const sdt = request.body.sdt;
	if (taikhoan) {
		connection.query('SELECT * FROM giaovien WHERE taikhoan = ? ', [taikhoan], function(error, results, fields) {
		if (results.length === 0) {
   		var sql = " insert into giaovien values(null,'" + name + "','" + diachi + "','" + sdt + "','" + taikhoan + "','" + matkhau + "')"
    	connection.query(sql,function(err){
        if (err) throw err
        console.log('Data saved success...');
        response.redirect('/admin');
		})
	} else {
		response.send('Tai Khoan Trung.Vui long doi ten dang nhap khac');	
	}   
	})
	}
	});
Arouter.post('/alogin', urlencodedParser, function(request, response) {
	const taikhoan = request.body.tendn;
	const matkhau = md5(request.body.mk);
	var id;
	if (taikhoan && matkhau) {
		connection.query('SELECT * FROM giaovien WHERE taikhoan = ? AND matkhau = ?', [taikhoan, matkhau], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.taikhoan = taikhoan;
				session.id = results[0].id;
				session.hoten = results[0].hoten;
				response.redirect('/admin/trangchuad');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

Arouter.get('/delete/(:id)', function(request, response, next) {

    let id = request.params.id;

    connection.query('DELETE FROM khoahoc WHERE id = ? ' ,[id], function(err, result) {
        //if(err) throw err
        if (err) {
			console.log(err);
            request.flash('error', err)
         
            response.redirect('/khoahocad')
        } else {
            request.flash('success', 'Khoa hoc da duoc xoa! ID = ?', [id])
            response.redirect('/khoahocad') 
        }
    });
});
Arouter.get('/khoahocnchad', function(request, response, next) {
    if(request.session.loggedin) {
    connection.query('SELECT * FROM nhucauhoc ORDER BY id asc',function(err,rows)     {
        if(err) {
            request.flash('error', err);
            response.render('./lophocnchad',{data:''});
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
            response.render('./lophocnchad',{data:rows});
        }
		})

	}
	else{
		response.send('Please Login To View This Page!');
	}
}); 
Arouter.get('/khoahochvad',function(request,response,next){
	if(request.session.loggedin){
		connection.query('SELECT * FROM lop_hocvien',function(err,rows){
			if(err){
				request.flash('error',err);
				response.render('lophochvad',{data:''});
			}else{
				response.render('lophochvad',{data:rows});
			}
		});
	} else{
		response.send('Please login to view this page!');
	}
});
Arouter.post('/kick/(:id)',function(request,response,next){
	id = request.params.id;
	connection.query('DELETE FROM lop_hocvien where id = '+id,function(err,rows){
		if(err){
			console.log(err);
			request.flash('error',err);
			response.redirect('./khoahochvad');
		} else{
			request.flash('success','Da Xoa');
			response.redirect('../khoahochvad');
		}
	});
});



module.exports = Arouter;