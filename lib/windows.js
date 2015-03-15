var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter
var windows = require('node-windows')
var Platform = require('./Platform.js')
var launch = require('./launch.js')
var path = require('path')
var child = require('child_process')
var launcherOutputParser = require('./launcherOutputParser.js')
var through2 = require('through2')

var LAUNCH_TOOL = path.resolve(__dirname, '..', 'bin', 'launcher.exe')
var LAUNCH_LOW_TOOL = path.resolve(__dirname, '..', 'bin', 'deelevator.exe')

module.exports = Windows

inherits(Windows, Platform)
function Windows() {
	Platform.call(this)
}

Windows.prototype.service = function(serviceConfig) {
	return new windows.Service(serviceConfig)
}

Windows.prototype.logger = function (name) {
	return new windows.EventLogger(name)
}

Windows.prototype.launch = function (app) {

	return this._launch(app)
}

Windows.prototype.launchElevated = function (app) {
	return this._launch(app, 'admin')
}

Windows.prototype.launchLow = function (app) {	
	return this._launch(app, 'dekstop')
}

Windows.prototype._launch = function (app, user) {
	var command = app.command
	
	if (app.args) {
		command += ' ' + app.args.join(' ')
	}

	app.args = []

	if (user) {
		app.args.push('--runas')
		app.args.push(user)
	}

	app.args.push('--command')
	app.args.push(command)
	
	app.command = LAUNCH_TOOL

	// child.stdout.pipe(through2(launcherOutputParser())).on('data', function(d) {
	// 	console.log(1, d)
	// 	child.emit('sub process data', d)
	// }).on('error', console.log)
	
	return Windows.super_.prototype.launch.call(this, app)
}

Windows.prototype.listProcesses = function(callback) {	
	child.execFile('wmic', ['process', 'get', 'ProcessId,CommandLine'], { maxBuffer: 400 * 1024 }, function(err, stdout, stderr) {

		if (err) return callback(err)

		parseListProcessesResult(stdout, 'wmic process get ProcessId,CommandLine', callback)
	})
}

Windows.prototype.listChildProcesses = function(pid, callback) {
	var hideWmic = this.hideWmicProcess
	child.execFile('wmic', ['process', 'where(parentProcessId=' + pid + ')', 'get', 'ProcessId,CommandLine'], { maxBuffer: 400 * 1024 }, function(err, stdout, stderr) {

		if (err) return callback(err)

		parseListProcessesResult(stdout, 'wmic process get ProcessId,CommandLine', callback)
	})	
}

function parseListProcessesResult(stdout, filter, callback) {
	if (typeof filter === 'function') {
		callback = filter
		filter = undefined
	}

	var lines = stdout.split('\n')

	var header = lines.shift()
	var col1width = header.indexOf('ProcessId')
	var results = []

	for (var i = 0; i < lines.length; i++) {
		var line = lines[i]
		var command = line.substr(0, col1width).trim()

		if (!command) continue
		if (command === filter) continue

		results.push({
			command: command,
			pid: parseInt(line.substr(col1width))
		})
	}

	callback(null, results)
}

Windows.prototype._extractOsSpecificPort = function (obj) {
	return obj.windows
}

/************************************************/
/*				private stuff					*/
/************************************************/

function launchElevated(command, args, options) {
	var adapter = new ChildProcessAdapter()

	windows.elevate(command + ' ' + args.join(' '), options, adapter.callback())

	return adapter
}

/*
 *	Using this to mimic a real child object returned from child_process.spawn()
 * 
 */
inherits(ChildProcessAdapter, EventEmitter)
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
