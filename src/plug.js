'use strict'

function Plug(options) {
	options || (options = {})
	this.resource = options.resource
	this.pipe = options.pipe
}

Plug.prototype._request = function(req, res) {
	return this.pipe.apply(this, arguments)
}

module.exports = Plug
