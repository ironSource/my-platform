var nssocket = require('nssocket')
var launch = require('./launch.js')
var childProcess = require('child_process')

module.exports = Platform

function Platform(config) {
	this._config = config
}

Platform.prototype.createServer = function(connectionListener, startedListener) {
	var server = nssocket.createServer(connectionListener)
	
	server.listen(this._config.port, function (err) {
		startedListener(err, server)
	})
}

Platform.prototype.connect = function(connectListener) {
	var socket = new nssocket.NsSocket()

	socket.connect(this._config.port, function (err) {
		connectListener(err, socket)
	})
}

Platform.prototype.launch = function (app) {
	return launch(childProcess.spawn, app)
}

Platform.prototype.launchElevated = function (app) {
	throw new Error('must implement')
}

Platform.prototype.service = function(config) {
	throw new Error('must implement')	
}

Platform.prototype.logger = function(name) {
	throw new Error('must implement')
}
