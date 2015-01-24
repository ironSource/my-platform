var inherits = require('util').inherits
var Platform = require('./Platform.js')
var launch = require('./launch.js')
var mac = require('node-mac')

module.exports = Osx

inherits(Osx, Platform)
function Osx(config) {
	Platform.call(this, config.osx)
}

Osx.prototype.service = function(serviceConfig) {
	return new mac.Service(serviceConfig)
}

Osx.prototype.launchElevated = function (app) {
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
