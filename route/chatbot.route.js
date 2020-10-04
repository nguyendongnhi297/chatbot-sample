const express = require('express');
const socketIO = require('socket.io'); 
const http = require('http') 
var app = express();
///let server = http.createServer(app) 
//let io = socketIO(server) 
///var http = require('http')
//var io = require('socket.io')(http);      //chat application
//CSDL
//var mysql = require('mysql');
//var connection = require('./db');
//
///const app = express();
//const io = require('socket.io');
var router = express.Router();
//router.use( express.static(__dirname) );
var { NlpManager } = require('node-nlp');       //natural language processing for chatbot
const manager = new NlpManager({ languages: ['vi'], nlu: { useNoneFeature: false }});

//train the chatbot
//Hỏi tên
manager.addDocument('vi','Tên của bạn là gì?','greetings.name');
manager.addDocument('vi','Tên của bạn?','greetings.name');
manager.addDocument('vi','Mình có thể gọi bạn như thế nào?','greetings.name');
//Xin chào
manager.addDocument('vi', 'Chào', 'greetings.hi');
manager.addDocument('vi', 'Hello', 'greetings.hi');
manager.addDocument('vi', 'Hi', 'greetings.hi');  
//Tạm Biệt
manager.addDocument('vi', 'Tạm biệt', 'greetings.bye');
manager.addDocument('vi', 'Gặp lại sau', 'greetings.bye');
manager.addDocument('vi', 'Mình bận rồi', 'greetings.bye');
//Địa chỉ
manager.addDocument('vi','Trung tâm các cậu ở đâu?','questions.address');
manager.addDocument('vi','Địa chỉ của trung tâm?','questions.address');
manager.addDocument('vi','Trung tâm ở đâu?','questions.address');
manager.addDocument('vi','Địa chỉ phòng Yoga ở đâu?','questions.address');
//Độ tuổi
manager.addDocument('vi','Các độ tuổi nao có thể tham gia trung tâm?','questions.age');
manager.addDocument('vi','Ở trung tâm có thể có độ tuổi nào?','questions.age');
manager.addDocument('vi','Yoga có thể tập từ bao nhiêu tuổi?','questions.age');
// Kĩ Năng
manager.addDocument('vi','Các kĩ năng nào được dạy trung tâm?','questions.skill');
manager.addDocument('vi','Ở trung tâm có thể học được những kĩ năng nào?','questions.skill');
manager.addDocument('vi','Kĩ năng yoga nào có ở trung tâm ?','questions.skill');
manager.addDocument('vi','Kĩ năng?','questions.skill');
// buổi học
manager.addDocument('vi','Ở trung tâm có thể có những buổi học nào?','questions.time');
manager.addDocument('vi','Trung tâm có các buổi học nào?','questions.time');
manager.addDocument('vi','Có thể đi học vào các buổi nào?','questions.time');
//Thời gian học tổng
manager.addDocument('vi','Trung tâm bắt đầu dạy lúc mấy giờ?','questions.hour');
manager.addDocument('vi','Trung tâm thường mở khi nào?','questions.hour');
manager.addDocument('vi','Mấy giờ các buổi lên lớp?','questions.hour');
manager.addDocument('vi','Giờ lên lớp là khi nào?','question.hour');
//Thời gian học buổi sáng
manager.addDocument('vi','Buổi sáng thường bắt đầu vào mấy giờ?','questions.timem');
manager.addDocument('vi','Trung tâm thường mở buổi sáng khi nào?','questions.timem');
manager.addDocument('vi','Mấy giờ thì lên lớp buổi sáng?','questions.timem');
manager.addDocument('vi','Giờ lên lớp buổi sáng là khi nào?','questions.timem');
//Thời gian học buổi chiều
manager.addDocument('vi','Buổi chiều thường bắt đầu vào mấy giờ?','questions.timee');
manager.addDocument('vi','Trung tâm thường mở buổi chiều khi nào?','questions.timee');
manager.addDocument('vi','Mấy giờ thì lên lớp buổi chiều?','questions.timee');
manager.addDocument('vi','Giờ lên lớp buổi chiều là khi nào?','questions.timee');
//Thời gian học buổi tối
 manager.addDocument('vi','Buổi tối thường bắt đầu vào mấy giờ?','questions.timen');
 manager.addDocument('vi','Trung tâm thường mở buổi tối khi nào?','questions.timen');
 manager.addDocument('vi','Mấy giờ thì lên lớp buổi tối?','questions.timen');
 manager.addDocument('vi','Giờ lên lớp buổi tối là khi nào?','questions.timen');
 //Lợi ích của việt tập YOga.
 manager.addDocument('vi','Tập Yoga mang lại những lợi ích gi?','questions.adven');
 manager.addDocument('vi','Yoga ảnh hưởng thế nào đến cuộc sống của chúng ta?','questions.adven');
 manager.addDocument('vi','Yoga là gì?','questions.adven');
 manager.addDocument('vi','Những lợi ích mà Yoga mang lại?','questions.adven');
//Định nghĩa Yoga gentle
 manager.addDocument('vi','Yoga gentle là gì?','questions.skills.gentle');
 manager.addDocument('vi','Kĩ năng Yoga gentle là gì?','questions.skills.gentle');
 manager.addDocument('vi','Thế nào là Yoga gentle?','questions.skills.gentle');
 manager.addDocument('vi','Tôi có thể hiểu Yoga gentle là gì?','questions.skills.gentle');
//Định nghĩa Dynamic Yoga
 manager.addDocument('vi','Buổi tối thường bắt đầu vào mấy giờ?','questions.timen');
 manager.addDocument('vi','Trung tâm thường mở buổi tối khi nào?','questions.timen');
 manager.addDocument('vi','Mấy giờ thì lên lớp buổi tối?','questions.timen');
 manager.addDocument('vi','Giờ lên lớp buổi tối là khi nào?','questions.timen');
//Định nghĩa High Fly
 manager.addDocument('vi','Buổi tối thường bắt đầu vào mấy giờ?','questions.timen');
 manager.addDocument('vi','Trung tâm thường mở buổi tối khi nào?','questions.timen');
 manager.addDocument('vi','Mấy giờ thì lên lớp buổi tối?','questions.timen');
 manager.addDocument('vi','Giờ lên lớp buổi tối là khi nào?','questions.timen');
  //Định nghĩa Yoga twist
 manager.addDocument('vi','Buổi tối thường bắt đầu vào mấy giờ?','questions.timen');
 manager.addDocument('vi','Trung tâm thường mở buổi tối khi nào?','questions.timen');
 manager.addDocument('vi','Mấy giờ thì lên lớp buổi tối?','questions.timen');
 manager.addDocument('vi','Giờ lên lớp buổi tối là khi nào?','questions.timen');
/*         //Định nghĩa các bài tập YOga
 manager.addDocument('vi','Buổi tối thường bắt đầu vào mấy giờ?','questions.timen');
 manager.addDocument('vi','Trung tâm thường mở buổi tối khi nào?','questions.timen');
 manager.addDocument('vi','Mấy giờ thì lên lớp buổi tối?','questions.timen');
 manager.addDocument('vi','Giờ lên lớp buổi tối là khi nào?','questions.timen');
    */
//***********************************************************************************//
//************************************************************************************//
//************************************************************************************//
//************************************************************************************//
//************************************************************************************//
//Hỏi tên
manager.addAnswer('vi','greetings.name','Tên mình là Pinky');
manager.addAnswer('vi','greetings.name','Mọi người thường gọi mình là Pinky');
manager.addAnswer('vi','greetings.name','Mình rất vui khi được bạn gọi là Pinky');
//Trả lời xin chào
manager.addAnswer('vi', 'greetings.hi', 'Xin chào');
manager.addAnswer('vi', 'greetings.hi', 'Hello bạn.');
manager.addAnswer('vi', 'greetings.hi', 'Hi,Xin chào bạn!');
manager.addAnswer('vi', 'greetings.hi', 'Chào bạn');



//Trả Lời Chào tạm biệt
manager.addAnswer('vi', 'greetings.bye', 'Tạm biệt bạn');
manager.addAnswer('vi', 'greetings.bye', 'Hẹn gặp lại.');
manager.addAnswer('vi', 'greetings.bye', 'Gặp lại sau.');
manager.addAnswer('vi', 'greetings.bye', 'Hẹn bạn lần khác.');
manager.addAnswer('vi', 'greetings.bye', 'Rất mong được trò chuyện cùng bạn lần tiếp theo.');

//Trả Lời Địa Chỉ
manager.addAnswer('vi','questions.address','<a href="https://www.google.com/maps/place/291+C%C3%A1ch+M%E1%BA%A1ng+Th%C3%A1ng+T%C3%A1m,+Ph%C6%B0%E1%BB%9Dng+12,+Qu%E1%BA%ADn+10,+H%E1%BB%93+Ch%C3%AD+Minh/@10.7792476,106.6764748,17z/data=!3m1!4b1!4m5!3m4!1s0x31752f27d3f1db71:0xd9db33fce57ecdb7!8m2!3d10.7792476!4d106.6786635?hl=vi-VN" target="_blank" style="color:blue">Trung tâm nằm ở:291 Cách Mạng Tháng Tám, Phường 12, Quận 10, Thành phố Hồ Chí Minh</a>');
manager.addAnswer('vi','questions.address','<a href="https://www.google.com/maps/place/291+C%C3%A1ch+M%E1%BA%A1ng+Th%C3%A1ng+T%C3%A1m,+Ph%C6%B0%E1%BB%9Dng+12,+Qu%E1%BA%ADn+10,+H%E1%BB%93+Ch%C3%AD+Minh/@10.7792476,106.6764748,17z/data=!3m1!4b1!4m5!3m4!1s0x31752f27d3f1db71:0xd9db33fce57ecdb7!8m2!3d10.7792476!4d106.6786635?hl=vi-VN" target="_blank" style="color:blue"> Bạn có thể xem trên bản đồ. </a>');
//Trả lời độ tuổi
manager.addAnswer('vi','questions.age','Bất kì độ tuổi nào từ 5 đến 60 tuổi');
manager.addAnswer('vi','questions.age','Đối với Yoga thì trẻ em có thể tập Yoga từ năm 5 tuổi và người già thì có thể đến 60 tuổi ');
//Trả lời kĩ năng
manager.addAnswer('vi','questions.skill','Trung tâm có dạy 4 kĩ năng là :1.Gentle,<br>2.Dynamic ,<br>3.High Fly,<br>4.Yoga Twist.');
manager.addAnswer('vi','questions.skill','Bao gồm 4 kĩ năng :Gentle,Dynamic ,High Fly,Yoga Twist.');
manager.addAnswer('vi','questions.skill','Trung tâm của em đào tạo các kỹ năng :1.Gentle,<br>2.Dynamic ,<br>3.High Fly,<br>4.Yoga Twist.');
//Trả lời buổi học
manager.addAnswer('vi','questions.time','Trung tâm bao gồm 3 buổi Sáng,Chiều và Tối');
manager.addAnswer('vi','questions.time','Trung tâm chúng tôi thường dạy vào 3 buổi: Sáng,Chiều và Tối ');
manager.addAnswer('vi','questions.time','Có 3 buổi học gồm: Sáng,Chiều và Tối');
//Trả lời thời gian học tổng
manager.addAnswer('vi','questions.hour','Buổi sáng thường bắt đầu lúc 7h30 ,Buổi trưa thường bắt đầu lúc 15h30,Buổi tối thường bắt đầu lúc 19h');
manager.addAnswer('vi','questions.hour','Các buổi thường bắt đầu lúc: Sáng :7h30 <br> Trưa :15h30 <br> Chiều :19h');
manager.addAnswer('vi','questions.hour','Trung tâm thường bắt đầu lớp học lúc 7h30 ,Buổi trưa thường bắt đầu lúc 3h30,Buổi tối thường bắt đầu lúc 7h');
//Trả lời Thời gian học buổi sáng
manager.addAnswer('vi','questions.timem','Buổi sáng thường bắt đầu lúc 7h30');
manager.addAnswer('vi','questions.timem','Lớp học sáng thường bắt đầu vào 7h30');
manager.addAnswer('vi','questions.timem','7h30 là thời gian mở lớp học sáng  ');
//Trả lời Thời gian học buổi chiều
manager.addAnswer('vi','questions.timee','Buổi chiều thường bắt đầu lúc 15h30');
manager.addAnswer('vi','questions.timee','Lớp học chiều thường bắt đầu vào 15h30');
manager.addAnswer('vi','questions.timee','15h30 là thời gian mở lớp học chiều  ');
//Trả lời Thời gian học buổi tối
manager.addAnswer('vi','questions.timen','Buổi tối thường bắt đầu lúc 19h');
manager.addAnswer('vi','questions.timen','Lớp học tối thường bắt đầu vào 19h');
manager.addAnswer('vi','questions.timen','19h là thời gian mở lớp học tối');
//Trả lời Lợi ích của việt tập YOga.
manager.addAnswer('vi','questions.adven','Bạn có thể tham khảo <a href="https://www.cfyc.com.vn/yoga/loi-ich-yoga.html" target="_blank" style="color:blue">tại đây</a>');
manager.addAnswer('vi','questions.adven','Việc tập Yoga có thể mang lại cho ta nhiều lợi ích như:<a href="https://huonganhyoga.vn/14-loi-ich-cua-yoga-doi-voi-co-the-ma-ban-khong-ngo-toi.html" target="_blank" style="color :blue"> Tìm hiểu thêm.</a>');
manager.addAnswer('vi','questions.adven','Các lợi ích yoga mang lại như:<a href=https://www.cfyc.com.vn/yoga/loi-ich-yoga.html" target="_blank" style="color:blue">Bài báo 1</a>,<a href=https://www.cfyc.com.vn/yoga/loi-ich-yoga.html" target="_blank" style="color:blue">Bài báo 2</a>,<a href="https://yogacuocsong.com/7-loi-ich-vang-cua-yoga/" target="_blank" style="color:blue">Bài báo 3</a>');
//Trả lời Yoga gentle là gì?.
manager.addAnswer('vi','questions.skills.gentle','Bạn có thể tham khảo về Yoga Gentle <a href="http://www.yogaplus.vn/blog/gentle-yoga-co-phai-la-lop-hoc-yoga-danh-cho-ngoi-moi-bat-dau" target="_blank" style="color:blue">tại đây</a>');
manager.addAnswer('vi','questions.skills.gentle','Là một bộ môn bao gồm các tư thế Yoga chậm và đơn giản, nhẹ nhàng hơn các bộ môn Yoga khác nhiều.Đa phần các động tác trong Gentle Yoga thường có tác dụng đến hệ cơ và xương nhưng ít gây căng thẳng và không gây quá phức tạp.<a href="http://www.yogaplus.vn/blog/gentle-yoga-co-phai-la-lop-hoc-yoga-danh-cho-ngoi-moi-bat-dau" target="_blank" style="color :blue"> Tìm hiểu thêm.</a>');
manager.addAnswer('vi','questions.skills.gentle','Các lợi ích yoga Gentle mang lại như trong <a href=http://www.yogaplus.vn/blog/gentle-yoga-co-phai-la-lop-hoc-yoga-danh-cho-ngoi-moi-bat-dau" target="_blank" style="color:blue">Bài báo</a>');


async function botstr(findStr){
    await manager.train();
    manager.save();
      var response = await manager.process('vi' , findStr);
      console.log(response.answer);
  
      //console.log(typeof(response.answer));
      return response.answer;
}
function con(req){
  ;
}
/*router.get('/train',function(req,res){
  var io = req.app.get('socketio');
  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
    console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
      console.log('message:' + msg);
      io.emit('chat message', msg);
      botstr(msg)
          .then(result => {
              if(result == null){
                io.emit('chat message', "Xin lỗi bạn.");
              }
              else{
                io.emit('chat message', result);
              }
          });
  
    });
  })
})*/
/*router.get('/submit', function(req, res){ 
    var io = req.app.get('socketio');
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
        console.log('user disconnected');
        });
        socket.on('chat message', function(msg){
          console.log('message: ' + msg);
          io.emit('chat message', msg);
          botstr(msg)
              .then(result => {
                  if(result == null){
                    io.emit('chat message', "Xin lỗi bạn.");
                  }
                  else{
                    io.emit('chat message', result);
                  }
              });
      
        });
      });
   // res.render('./chatbot')
  //res.sendFile(__dirname + '/chatbot.ejs');
});*/

module.exports = router;