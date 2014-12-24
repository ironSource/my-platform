/*
 *	an implementation of platform interface for osx
 */
var fs = require('fs')
var nssocket = require('nssocket')
var mac = require('node-mac')
var childProcess = require('child_process')
var util = require('util')
var launch = require('./launch.js')

/************************************************/
/*				public api						*/
/************************************************/
module.exports.createServer = function (connectionListener, startedListener) {
	var server = nssocket.createServer(connectionListener)

	server.listen(9000, function (err) {		
		startedListener(err, server)
	})
}

module.exports.connect = function (connectListener) {
	var socket = new nssocket.NsSocket()
	socket.connect(9000, function (err) {
		connectListener(err, socket)
	})
}

module.exports.Service = mac.Service

module.exports.launch = function(app) {
	return launch(childProcess.spawn, app)
}

module.exports.launchElevated = function (app) {
	return launch(launchElevated, app)
}

/************************************************/
/*				private stuff					*/
/************************************************/

function launchElevated(command, args, options) {
	if (!util.isArray(args)) {
		args = []
	}

	args.unshift(command)
	
	return childProcess.spawn('sudo', args, options)
}
