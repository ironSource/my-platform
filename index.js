var isos = require('isos')

if (isos('windows')) {
	module.exports = require('./lib/Windows.js')
} else if (isos('osx')) {
	module.exports = require('./lib/Osx.js')
} else {
	throw new Error('this operating system is not currently supported')
}
