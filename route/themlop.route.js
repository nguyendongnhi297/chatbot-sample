var express = require('express');
var Crouter = express.Router();
var connection = require('./db');
var controller = require('../controller/themlop.controller');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require('express-session');
Crouter.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//Crouter.get('/',controller.index)
Crouter.get('/', function(request, response) {
	if (request.session.loggedin) {
        response.render('./thembh');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});
Crouter.get('/suakh', function(request, response) {
        response.render('./sualop');
});
Crouter.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: true });
Crouter.use(upload.array());

Crouter.post('/addkh',urlencodedParser, function(request,response,next){
    const baihoc = request.body.baihoc;
    const mieuta = request.body.mieuta;
    const ngaybd = request.body.ngaybd;
    const ngaykt = request.body.ngaykt;
    const buoihoc = request.body.buoihoc;
    const kinang = request.body.kinang;
    const dotuoi = request.body.dotuoi;
	const hocphi = request.body.hocphi;
	const giaovien_id = session.id;
    const giaovien = session.hoten;
   var sql = " insert into khoahoc values(null,'" + baihoc + "','" + mieuta + "','" + ngaybd + "','" + ngaykt+ "','" + buoihoc + "','" + kinang + "','" + dotuoi + "','" + hocphi + "','" + giaovien_id + "','" + giaovien + "')"
    connection.query(sql,function(err){
        if (err) throw err
        console.log('Data saved success...');
        response.redirect('/admin/trangchuad');
    })   
});
Crouter.get('/sualop/(:id)',function(request,response,next)
{
	id = request.params.id;
	connection.query("SELECT * FROM khoahoc where id = ? ",[id],function(err,rows){
		if (err) throw err
		if(rows.length  <= 0){
			request.flash('error','Khoa hoc khong tim thay id = ?',[id]);
			response.redirect('/khoahocad');
		}
		else{
			response.render('sualop', {
				title:'Sua Lop Hoc',
				id: rows[0].id,
				baihoc: rows[0].baihoc,
				mieuta: rows[0].mieuta,
				ngaybd: rows[0].NgayBatDau,
				ngaykt: rows[0].NgayKetThuc,
				buoihoc: rows[0].ngayhoc_id,
				kinang: rows[0].kinang_id,
				dotuoi: rows[0].dotuoi_id,
				hocphi: rows[0].hocphi,
				giaovien:rows[0].giaovien_id
			})
		}
	})

})

Crouter.post('/update/:id',function(request,response,next){
	let id = request.body.id;
	let baihoc = request.body.baihoc;
	let mieuta = request.body.mieuta;
	let ngaybd = request.body.ngaybd;
	let ngaykt = request.body.ngaykt;
	let buoihoc = request.body.buoihoc;
	let kinang = request.body.kinang;
	let dotuoi = request.body.dotuoi;
	let hocphi = request.body.hocphi;
	let giaovien = session.id;
		var form_data = {
			baihoc : baihoc,
			mieuta : mieuta,
			NgayBatDau : ngaybd,
			NgayKetThuc : ngaykt,
			ngayhoc_id : buoihoc,
			kinang_id : kinang,
			dotuoi_id : dotuoi,
			hocphi : hocphi,
			giaovien_id : giaovien,
		}
		connection.query('Update khoahoc SET ? where id = ' + id,form_data,function(result,row,err)
		{
			if(err){
				request.flash('error',err)
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
				response.render('./sualop',{
					id : request.params.id,
					mieuta : form_data.mieuta,
					ngaybd : form_data.NgayBatDau,
					ngaykt : form_data.NgayKetThuc,
					buoihoc : form_data.ngayhoc_id,
					kinang : form_data.kinang_id,
					dotuoi : form_data.dotuoi_id,
					hocphi : form_data.hocphi,
					giaovien :form_data.giaovien_id
				})
			} else{
				request.flash('Data have updated');
				response.redirect('/khoahocad');
			}
		})	
})

module.exports = Crouter;