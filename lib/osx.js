/*
 *	an implementation of platform interface for osx
 */
var fs = require('fs')
var nssocket = require('nssocket')
var mac = require('node-mac')
var childProcess = require('child_process')
var util = require('util')
var launch = require('./launch.js')
var config = require('./config')

/************************************************/
/*				public api						*/
/************************************************/

module.exports.Service = mac.Service

module.exports.createServer = function (connectionListener, startedListener) {
	var server = nssocket.createServer(connectionListener)

	server.listen(config.osx.port, function (err) {		
		startedListener(err, server)
	})
}

module.exports.connect = function (connectListener) {
	var socket = new nssocket.NsSocket()
	socket.connect(config.osx.port, function (err) {
		connectListener(err, socket)
	})
}

module.exports.logger = function (name) {
	// TODO add /var/log logger here
	throw new Error('TBD')
}

module.exports.launch = function(app) {
	return launch(childProcess.spawn, app)
}

module.exports.launchElevated = function (app) {
	return launch(launchElevated, app)
}

module.exports.config = config.osx

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
