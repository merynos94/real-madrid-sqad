var express = require('express');
var path = require('path');
var mysql = require('mysql');
var myConnection  = require('express-myconnection');

var app = express();
app.use(express.urlencoded());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var dbOptions = {
	host: 'localhost',
	user: 'node1',
	password: 'node1',
	database: 'node1',
	port: 3306
}
app.use(myConnection(mysql, dbOptions, 'pool'))

app.get('/',function(req,res){

	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM films',function(err, rows, fields) {
			var filmList=rows;
			res.render('list',{
				filmList:filmList
			});
		});
	});

});
app.get('/add',function(req,res){
	res.render('add');
});
app.post('/add',function(req,res){
	var film={
		name:req.body.name,
		year:parseInt(req.body.year)
	}
	req.getConnection(function(error, conn) {
		conn.query('INSERT INTO films SET ?',film,function(err, result){
			if(err){
				var message='Wystąpił błąd';
			}else{
				var message='Dodano nowy film';
			}

			res.render('add',{
				message: message
			});

		});

	})
});
app.get('/edit/(:id)', function(req, res, next){ 
	req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM films WHERE id='+req.params.id,function(err, rows, fields) {
            res.render('edit', {
		        		id: rows[0].id,
                name: rows[0].name,
		        		year: parseInt(rows[0].year)
            })
        })
    })
})
app.post('/edit/(:id)', function(req, res, next){ 
	var film = {
        name: req.body.name,
        year: parseInt(req.body.year)
    }
	req.getConnection(function(error, conn) {
        conn.query('UPDATE films SET ? WHERE id='+req.params.id,film, function(err, result) {
            res.render('edit', {
                message: 'Zmieniono dane',
		        id: req.params.id,
                name: req.body.name,
                year: parseInt(req.body.year)
		    })
        })
    })   
})
app.get('/del/(:id)', function(req, res, next){ 
	req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM films WHERE id='+req.params.id,function(err, rows, fields) {
            res.render('del', {
		        id: rows[0].id,
                name: rows[0].name,
		        year: parseInt(rows[0].year)
            })
        })
    })
})
app.post('/del/(:id)', function(req, res, next){ 
	var film = {
        name: req.body.name,
        year:parseInt(req.body.year)
    }
	req.getConnection(function(error, conn) {
        conn.query('DELETE FROM films WHERE id='+req.params.id,film, function(err, result) {
            res.render('del', {
                message: 'Usunieto dane',
		        id: req.params.id,
                name: req.body.name,
                year: parseInt(req.body.year)
		    })
        })
    })
    
})
app.listen(3000);