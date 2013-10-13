// NETPLUG
// 2013, zenoamaro

'use strict'

var express = require('express'),
	http = require('http')

var Plug = require('./plug')

var DEFAULT_PORT = 2048


function NetPlug(options) {
	options || (options = {})
	this.root = options.root || ''
	this._resources = {}
}

NetPlug.Plug = Plug

NetPlug.prototype.listen = function(port) {
	var self = this,
		port = port || DEFAULT_PORT
	//
	var server = http.createServer(function(req, res){
		console.log('Request from `%s` to `%s`', req.socket.remoteAddress, req.url)
		return self._request.apply(self, arguments)
	})
	//
	server.listen(port, function(){
		console.log('Listening on port ' + port)
	})
}

NetPlug.prototype._request = function(req, res) {
	//
	var url = req.url,
		plug = this._resources[url]

	if (plug)
		plug._request.apply(plug, arguments)

	else {
		var error = 'No plug at ' + url
		console.log(error)
		res.statusCode = 404
		res.end(error+'\n')
	}
}

NetPlug.prototype._makePlug = function(pipe) {
	return new Plug({
		pipe: pipe
	})
}

NetPlug.prototype.plug = function(resource, plug) {
	var route = this.root + '/' + resource,
		plug = this._makePlug(plug)
	this._resources[route] = plug
	console.log('Plugged ' + route)
}


module.exports = NetPlug