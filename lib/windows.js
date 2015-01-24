var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter
var windows = require('node-windows')
var Platform = require('./Platform.js')
var launch = require('./launch.js')

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

Windows.prototype.launchElevated = function (app) {
	return launch(launchElevated, app)
}

Windows.prototype._extractOsSpecificPort = function (obj) {
	return obj.windows.port
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
