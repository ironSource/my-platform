var should = require('should')
var Platform = require('../index.js')
var dns = require('dns')
var path = require('path')

describe('platform', function () {
	var platform, port

	it('creates a server', function (done) {
	
		platform.createServer(port, onConnection, onStarted)

		function onConnection(connection) {}

		function onStarted(err, server) {
			if (err) return done(err)

			server.should.not.be.Null
			server.close()
			done()
		}
	})

	it('connects to the server', function (done) {
		platform.createServer(port, function () {}, function (err, server) {
			if (err) return done(err)
				
			platform.connect(port, onConnect)	
		})

		function onConnect(err, client) {
			if (err) return done(err)

			client.should.not.be.Null
			done()
		}		
	})

	it('launches a process', function (done) {
		this.timeout(2000)

		var child = platform.launch({ command: 'node', args: [ path.join(__dirname, 'lib', 'testprocess.js') ] })

		child.stdout.on('data', function(d) {
			d.toString().should.eql('ok\n')
		})

		child.stderr.on('data', function (d) {
			console.log(d.toString())
			done(new Error('child process should not have failed'))
		})

		child.on('error', done)

		child.on('exit', function () {
			done()
		})
	})

	it('launches an elevated process', function (done) {
		this.timeout(20000)

		var child = platform.launchElevated({ command: 'node', args: [ path.join(__dirname, 'lib', 'testprocess.js') ] })

		child.stdout.on('data', function(d) {
			d.toString().should.eql('ok\n')
		})

		child.stderr.on('data', function (d) {
			// hack
			d = d.toString()
			console.log(d)
			if (d !== 'Password:') {				
				done(new Error('child process should not have failed'))
			}
		})

		child.on('error', done)

		child.on('exit', function () {
			done()
		})
	})

	beforeEach(function () {
		platform = new Platform()
		port = {
			osx: 9000,
			windows: '\\\\.\\pipe\\test-service'
		}
	})
})
