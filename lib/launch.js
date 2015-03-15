var path = require('path')
var inspect = require('util')

var defaults = {
	detached: false,
	stdio: 'inherit'
}

module.exports = function launch(launchFn, app) {

	//app.options = app.options || defaults
	
	var child = launchFn(app.command, app.args, app.options)

	return child
}
