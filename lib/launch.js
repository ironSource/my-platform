var path = require('path')
var inspect = require('util')

module.exports = function launch(launchFn, app) {

	var options = {
		env: app.env || process.env,
		cwd: app.cwd || process.cwd(),
		detached: app.detached
		//stdio: 'pipe'
	}

	var child = launchFn(app.command, app.args, options)

	child.unref()

	return child
}
