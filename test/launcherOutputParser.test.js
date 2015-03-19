var launcherOutputParser = require('../lib/launcherOutputParser.js')
var should = require('should')

describe('windowsLauncher', function () {
	it('launcher output parser', function () {
		var separator = '|||||||'
		var before = 'kahdjkas'
		var after = 'xyzxyz'
		var output =  before + separator + after

		var parser = launcherOutputParser(separator)

		var pushedChunks = []
		parser.push = function (chunk) {
			console.log('pushing %s', chunk)
			pushedChunks.push(chunk)
		}

		function noop() {}

		parser(before + separator.substr(0, 5), 'utf8', noop)
		parser(separator.substr(5) + after, 'utf8', noop)
		
		var output = pushedChunks.join('')
		output.should.eql(after)
	})
})