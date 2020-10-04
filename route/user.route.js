var express = require('express');
const socketIO = require('socket.io'); 
var router = express.Router();
var controller = require('../controller/user.controller');
var connection = require('./db');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const passport = require('passport')
var md5 = require('md5');
router.get('/',controller.index);
router.get('/nchoc',controller.nchoc);

var session = require('express-session');
router.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
router.get('/trangchu', function(request, response) {
	if (request.session.loggedin) {
		var io = request.app.get('socketio');
  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
    console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
      console.log('message:' + msg);
      io.emit('chat message', msg);
      /*botstr(msg)
          .then(result => {
              if(result == null){
                io.emit('chat message', "Xin lỗi bạn.");
              }
              else{
                io.emit('chat message', result);
              }
          });*/
  
    });
  })
		response.render('./trangchu');
	} else {
		response.redirect('/')
		response.send('Please login to view this page! Hi');
	}
	response.end();
});

router.get('/khoahochv',function(request,response,next){
	id = session.id;
	if(request.session.loggedin){
		connection.query('SELECT * FROM lop_hocvien where hocvien_id = ? ',[id],function(err,rows){
			if(err) {
				request.flash('error', err);
				response.render('lophochv',{data:''});
			} else {
				response.render('lophochv',{data:rows});
			
			}
		});
		} else{
			response.redirect('/')
			response.send('Please login to view this page!');
		}
	});

router.get('/khoahocnch', function(request, response, next) {
		hocvien = session.id;
		if(request.session.loggedin) {
		connection.query('SELECT * FROM nhucauhoc where hocvien_id = ? ORDER BY id desc',[hocvien],function(err,rows)     {
			if(err) {
				request.flash('error', err);
				response.render('lophocnch',{data:''});
			} else {
				
				response.render('lophocnch',{data:rows});
			}
		});
		} else{
			response.redirect('/')
			response.send('Please login to view this page!');
		}
});

router.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: true });
router.use(upload.array());
//add new user
router.post('/adduser',urlencodedParser, function(request,response,next){
    const name = request.body.fullname;
    const taikhoan = request.body.uname;
    const diachi = request.body.address;
    const matkhau = md5(request.body.psw);
	const sdt = request.body.sdt;
	if (taikhoan) {
		connection.query('SELECT * FROM hocvien WHERE taikhoan = ? ', [taikhoan], function(error, results, fields) {
		if (results.length === 0) 
		{
    		var sql = " insert into hocvien values(null,'" + name + "','" + diachi + "','" + sdt + "','" + taikhoan + "','" + matkhau + "')"
    		connection.query(sql,function(err){
        if (err) throw err
        	console.log('Data saved success...');
        	response.redirect('/');
		})
		} 
	else {
			response.send('Trung Tai Khoan Vui Long Chon Tai Khoan Khac!' + '<a href="/" style ="text-decoration :none">Thu Lai</a>')	
	    	}
	})
	}
});

router.post('/ulogin', urlencodedParser, function(request, response) {
	const taikhoan = request.body.tendn;
	const matkhau = md5(request.body.mk);
	if (taikhoan && matkhau) {
		connection.query('SELECT * FROM hocvien WHERE taikhoan = ? AND matkhau = ?', [taikhoan, matkhau], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.taikhoan = taikhoan;
				session.id = results[0].id;
				session.hoten = results[0].hoten
				response.redirect('/trangchu');
			} else {
				response.send('Sai Tai Khoan Hoac Mat Khau.Vui Long ' + '<a href="/" style ="text-decoration :none">Thu Lai</a>');
				//response.redirect('/');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
router.post('/regi/:id',urlencodedParser, function(request,response,next){
	const baihoc = request.params.id;
	const hocvien = session.id;
	const tenhocvien = session.hoten;
	if (hocvien && baihoc) {
		connection.query('SELECT * FROM lop_hocvien WHERE khoahoc_id = ? and hocvien_id = ? ', [baihoc,hocvien], function(error, results, fields) {
		if (results.length === 0) 
		{
   		var sql = " insert into lop_hocvien values(null,'" + baihoc + "','" + hocvien + "','" + tenhocvien + "')"
    	connection.query(sql,function(err){
        if (err) throw err
		console.log('Data saved success...');
		response.redirect('/khoahoc')
	})
			}
			else{
				response.send("Ban da dang ky lop hoc nay roi!");
			}
	 	})
	}
});
router.post('/out/(:id)',urlencodedParser,function(request,response,next){
	const id = request.params.id;
	connection.query('DELETE FROM lop_hocvien where id = ?',[id],function(err,rows){
		if(err){
			console.log(err);
			response.redirect('/khoahochv');
		}
		else{
			request.flash("success","Da Xoa id = ?",+id);	
			response.redirect('/khoahochv');	
		}
	});
})
router.post('/khoahocnch/theonch/regi/:id',urlencodedParser, function(request,response,next){
    const baihoc = request.params.id;
    const hocvien = session.id;
   var sql = " insert into lop_hocvien values(null,'" + baihoc + "','" + hocvien + "')"
    connection.query(sql,function(err){
        if (err) throw err
		console.log('Data saved success...');
		response.redirect('/khoahoc')
	})
});

router.post('/nchoc/themnc',urlencodedParser, function(request,response,next){
    const ngaydk = request.body.ngaydk;
    const kinang = request.body.kinang;
    const dotuoi = request.body.dotuoi;
	const buoihoc = request.body.buoihoc;
	const hocvien = session.id;
	var sql = " insert into nhucauhoc values(null,'" + ngaydk + "','" + hocvien + "','" + dotuoi + "','" + kinang + "','" + buoihoc + "')"
    		connection.query(sql,function(err){
        if (err) throw err
        	console.log('Data saved success...');
        	response.redirect('/khoahocnch');
		})		
});


router.post('/khoahocnch/theonch/:dotuoi,:kinang,:ngayhoc', function(request, response, next) {
	dotuoi = request.params.dotuoi;
	kinang = request.params.kinang;
	ngayhoc = request.params.ngayhoc;
    if(request.session.loggedin) {
    connection.query('SELECT * FROM khoahoc where dotuoi_id = ? and kinang_id = ? and ngayhoc_id = ? ORDER BY id desc',[dotuoi,kinang,ngayhoc],function(err,rows)     {
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
router.get('/nchoc/delete/(:id)', function(request, response, next) {

    let id = request.params.id;

    connection.query('DELETE FROM nhucauhoc WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
			console.log(err);
            request.flash('error', err)
         
            response.redirect('/khoahocnch')
        } else {
            request.flash('success', 'Khoa hoc da duoc xoa! ID = ' + id)
            response.redirect('/khoahocnch')
        }
    })
});


//end facebook login  
module.exports = router;