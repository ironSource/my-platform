var should = require('should')
var Platform = require('../index.js')
var dns = require('dns')
var path = require('path')
var isos = require('isos')

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

	it.only('launches a process', function (done) {
		this.timeout(2000)

		var child = platform.launch({ command: 'node', args: [ path.join(__dirname, 'lib', 'testprocess2.js') ] })
		
		var data = []
		var subProcessData = []
		child.stdout.on('data', function (d) {
			data.push(d.toString())
		})

		child.on('sub process data', function (d) {
			subProcessData.push(d.toString())
		})

		child.on('exit', function () {
			data.should.containEql('ok1\n')
			data.should.containEql('ok2\n')
			//subProcessData.should.containEql('{"exitCode":0x0}')
			done()
		})

		child.on('error', done)
	})

	var needToImplement = it.skip

	if (isos('windows')) {
		needToImplement = it
	}
	
	needToImplement('launches an elevated process', function (done) {
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

	needToImplement('launches a de elevated process', function (done) {
		this.timeout(20000)
		var app = { command: 'node', args: [ path.join(__dirname, 'lib', 'testprocess2.js') ] }
		var child = platform.launchLow(app)
		
		var ok = false

		child.stdout.on('data', function(d) {
			ok = true
			d.toString().should.eql('ok\n')
		})

		child.stderr.once('data', function (d) {
			done(new Error('child process should not have failed ' + d))
		})

		child.on('error', done)

		child.on('exit', function () {
			console.log('exit!!!!!!!!!!!!!!!!!!!!!!!')
			//ok.should.be.ok
			done()
		})
	})

	it('lists running processes', function (done) {
		platform.listProcesses(function(err, processes) {
			if (err) return done(err)

			var findCommand
			if (isos('windows')) {
				findCommand = 'C:\\Windows\\Explorer.EXE'
			} else if (isos('osx')) {
				findCommand = '/usr/sbin/syslogd'
			} else {
				throw new Error('os not supported')
			}

			var index = findProcessByCommand(processes, findCommand)
			index.should.be.greaterThan(-1)

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

function findProcessByCommand(processList, command) {
	command = command.toLowerCase()
	for (var i = 0; i < processList.length; i++) {
		if (processList[i].command.toLowerCase() === command) return i
	}

	return -1
}
