var nssocket = require('nssocket')
var launch = require('./launch.js')
var childProcess = require('child_process')

module.exports = Platform

function Platform() {	
}

/*
 *	@param [String|Number|Object] port - can be a string or a number. if its an object 
 *											then { osx: [String|Number], windows: [String|Number] }
 *
 *	@param [Function] connectionListener - will be invoked each time a connection is made to the server:
 *												function(connection) {}
 *
 *	@param [Function] startedListener - will be invoked when the server is listening and ready to accept connections:
 *											function (err, server) {}
 */
Platform.prototype.createServer = function(port, connectionListener, startedListener) {
	var server = nssocket.createServer(connectionListener)
	
	if (typeof port === 'object')
		port = this._extractOsSpecificPort(port)

	server.listen(port, function (err) {
		startedListener(err, server)
	})
}

/*
 *	@param [String|Number|Object] port - can be a string or a number. if its an object 
 *											then { osx: [String|Number], windows: [String|Number] }
 *
 *	@param [Function] connectListener - will be invoked when the client successfully connects to the server or an error
 *											occurred in the connection. function (err, socket) {}
 */
Platform.prototype.connect = function(port, connectListener) {
	var socket = new nssocket.NsSocket()

	if (typeof port === 'object')
		port = this._extractOsSpecificPort(port)

	socket.connect(port, function (err) {
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

Platform.prototype._extractOsSpecificPort = function (obj) {
	throw new Error('must implement')
}
