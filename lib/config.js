var rc = require('rc')

var defaults = {
	osx: {
		port: 9000
	},
	windows: {
		port: '\\\\.\\pipe\\my-service'
	}
}

module.exports = rc('my-platform', defaults)