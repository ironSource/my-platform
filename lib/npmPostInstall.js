var child = require('child_process')
var isos = require('isos')
var path = require('path')

var cwd = path.resolve(__dirname, '..')

console.log(cwd)

var options =  { cwd: cwd }

if (isos('windows')) {
	child.exec('npm install node-windows@0.1.7', options, callback)
} else if (isos('osx')) {
	child.exec('npm install node-mac@0.1.3', options, callback)
} else {
	error('Unsupported operating system')
}

function callback(err, stdout, stderr) {
	if (err) {
		return error(err.toString())
	}

	console.log(stdout)
}

function error(msg) {
	console.error(msg)
	process.exit(1)
}
