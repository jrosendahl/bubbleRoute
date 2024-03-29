'use strict';
var winston = require('winston');
var logger = winston.loggers.get('MainLog');

module.exports = function (request, response, appPath) {

	var pathSplit = request.url.pathname.split('/');
	var routeIndex = 0;
	var path = appPath;

	function bubbleDown () {
		routeIndex++;
		var route;
		try {
			path = path + '/' + pathSplit[routeIndex];
			route = require(path);
		}
		catch (err){
			logger.info(err);
			response.writeHead(404, {"Content-Type":"text/plain; charset=utf-8"});
			response.write("404 Not found");
			response.end();
			return false;
		}
		return route(request);
	}
	this.bubbleDown = bubbleDown;


	this.reply = {
		html: function(err, html) {
			if(err) {
				logger.error(err);
				logger.error(err.stack);
				response.writeHead(500, {"Content-Type":"text/plain; charset=utf-8"});
				response.write("500 Server Error.  Sorry :(");
				response.end();
			}
			else {
				response.statusCode = 200;
				response.setHeader('Content-Type','text/html; charset=utf-8');
				response.setHeader('Cache-Control', 'no-cache');
				response.setHeader('Set-Cookie', request.cookieHeader());
				response.write(html.stringifyHTML());
				response.end();
			}
		},
		json: function (err, obj) {
			if(err) {
				logger.error(err);
				logger.error(err.stack);
				response.writeHead(500, {"Content-Type":"application/json; charset=utf-8"});
				response.write("500 Server Error.  Sorry :(");
				response.end();
			}
			else {
				response.setHeader('Content-Type','text/html; charset=utf-8');
				response.setHeader('Cache-Control', 'no-cache');
				response.setHeader('Set-Cookie', request.cookieHeader());
				response.write(JSON.stringify(obj));
				response.end();
			}
		},
		text: function (err, file) {
			if(err) {
				response.writeHead(500, {'Content-Type': 'text/plain'});
				response.write("500 Server Error.  Sorry :(");
				logger.error(err.stack);
				response.end();
			} 
			else {
				response.statusCode = 200;
				response.setHeader('Content-Type',file.contentType);
				response.setHeader('Set-Cookie', request.cookieHeader());
				response.write(file.file);
				response.end();
			}
		},
		binary: function (err, file) {
			if(err) {
				response.writeHead(500, {'Content-Type': 'text/plain'});
				response.write("500 Server Error.  Sorry :(");
				logger.error(err.stack);
				response.end();
			} 
			else {
				response.statusCode = 200;
				response.setHeader('Content-Type',file.contentType);
				response.setHeader('Set-Cookie', request.cookieHeader());
				response.write(file.file,'binary');
				response.end();
			}
		}	

	};
};

