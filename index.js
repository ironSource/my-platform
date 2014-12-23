var isos = require('isos')

if (isos('windows')) {
	module.exports = require('./lib/windows')
} else if (isos('osx')) {
	module.exports = require('./lib/osx')
} else {
	throw new Error('this operating system is not currently supported')
}
