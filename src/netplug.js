// NETPLUG
// 2013, zenoamaro

'use strict'

var express = require('express'),
	http = require('http')

var Plug = require('./plug')


function NetPlug(options) {
	options || (options = {})
	this.root = options.root || ''
	this._resources = {}
}

NetPlug.Plug = Plug

NetPlug.prototype.listen = function(port) {
	var self = this
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
		return plug._request.apply(plug, arguments)

	var error = 'No plug at ' + url
	console.log(error)
	res.statusCode = 404
	res.end(error+'\n')
}

NetPlug.prototype._routeForResource = function(resource) {
	return this.root + '/' + resource
}

NetPlug.prototype._makePlug = function(pipe) {
	return new Plug({
		pipe: pipe
	})
}

NetPlug.prototype.plug = function(resource, plug) {
	var route = this._routeForResource(resource),
		plug = this._makePlug(plug)
	this._resources[route] = plug
	console.log('Plugged ' + route)
}


module.exports = NetPlug