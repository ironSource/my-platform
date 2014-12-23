/*
 *	an implementation of platform interface for windows
 */
var nssocket = require('nssocket')
var childProcess = require('child_process')
var launch = require('./launch.js')
var windows = require('node-windows')
var EventEmitter = require('events').EventEmitter
var util = require('util')

var PIPE = module.exports.pipe = '\\\\.\\pipe\\myappscloud-service'
//var PIPE = 9000 // temporarily use tcp

module.exports.createServer = function(connectionListener, startedListener) {
	var server = nssocket.createServer(connectionListener)
	
	server.listen(PIPE, function (err) {
		startedListener(err, server)
	})
}

module.exports.connect = function(connectListener) {
	var socket = new nssocket.NsSocket()

	socket.connect(PIPE, function (err) {
		connectListener(err, socket)
	})
}

module.exports.Service = windows.Service

module.exports.launch = function (app) {
	return launch(childProcess.spawn, app)
}

module.exports.launchElevated = function (app) {
	return launch(launchElevated, app)
}

function launchElevated(command, args, options) {
	var adapter = new ChildProcessAdapter()

	windows.elevate(command + ' ' + args.join(' '), options, adapter.callback())

	return adapter
}

util.inherits(ChildProcessAdapter, EventEmitter)
function ChildProcessAdapter() {
	EventEmitter.call(this)

	// TODO transform these to fully blown read/write compatible streams
	this.stdout = new EventEmitter()
	this.stderr = new EventEmitter()		
}

ChildProcessAdapter.prototype.unref = function() {

}

ChildProcessAdapter.prototype.callback = function() {
	var adapter = this

	return function (err, stdout, stderr) {
		// TODO add proper expected exit codes like real child.on('exit')
		if (err) {
			if (stderr) {
				adapter.stderr.emit('data', stderr)
			}

			adapter.emit('error', err)
		} 

		if (stdout) {
			adapter.stdout.emit('data', stdout)
		}

		adapter.emit('exit')
	}	
}
