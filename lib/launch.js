var path = require('path')
var inspect = require('util')

var defaults = {
	detached: false,
	stdio: 'inherit'
}

module.exports = function launch(launchFn, app) {
	return launchFn(app.command, app.args, app.options)
}
