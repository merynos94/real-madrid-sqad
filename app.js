const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(function(req,res){
	const queryObject = url.parse(req.url,true).query;
	console.log(queryObject);
	let c = parseInt(queryObject.a)+parseInt(queryObject.b);

	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	res.end('test serwera node.js; a+b='+c);
});

server.listen(port, hostname, function(){
console.log('Server running at http://'+hostname+':'+port+'/');
});