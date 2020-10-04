
var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'yoga'
})
connection.connect((err) => {
    if (!err)
        console.log('Connected Database....');
        
    else
        console.log('Connected Database Failed....' + JSON.stringify(err,undefined,2));
});

module.exports = connection;