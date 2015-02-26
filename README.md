# my-platform
Provides OS platform specific functionality.
currently supports OSX and Windows

This module builds on top of 
- [node-windows](https://github.com/coreybutler/node-windows)
- [node-mac](https://github.com/coreybutler/node-mac)
- [RunAsSystem](https://github.com/michaelbadichi/RunAsSystem)

## API
This module exposes a unified api implemented differently for each OS

### Service(config)
export an os specific Service class that exposes methods to install, uninstall, start and stop an operating system service

```javascript
var Platform = require('my-platform')

var platform = new Platform({ osx: { port: ... }, windows: { port: ... }})
var service = platform.service({ ... service config ... })

service.install()
```

for service configuration options and full api, see [node-windows#Service](https://github.com/coreybutler/node-windows#windows-services) and [node-mac#Overview](https://github.com/coreybutler/node-mac#overview)

### launch(app) and launchElevated(app)
launches a child process, this process is detached from the parent and thus will not prevent the parent from existing when the event loop as no more calls in it. On windows the elevated process is lauched using a special executable (see [here](https://github.com/coreybutler/node-windows#elevate)) and on osx it is launched the same way as one would do "sudo ..."

```javascript
var Platform = require('my-platform')

var platform = new Platform({ osx: { port: ... }, windows: { port: ... }})

var child = platform.launch({ command: 'ls', args: ['-la']})
child.stdout.on('data', function (data) {
    console.log(data.toString())
})

```

### createServer(connectionListener, startedListener)
Creates a server that will receive connections from a client created using connect() (See below)

```javascript
var Platform = require('my-platform')

var platform = new Platform({ osx: { port: ... }, windows: { port: ... }})

function onConnection(connection) {
    connection.send(['event', 'app', '1234', 'exit'], { id: '1234' })
}

function onStarted(err, server) {
    console.log('server is listening')
}

platform.createServer(onConnection, onStarted) // does not return a server object!
```

### connect(connectListener)
connect to a server created by createServer()

```javascript
var Platform = require('my-platform')

var platform = new Platform({ osx: { port: ... }, windows: { port: ... }})

platform.connect(function (err, client) {
	if (err) {
		return console.log('ahhhhhhhhhh!', err)
	}

	client.data(['event', 'app', '1234', 'exit'], function () {
		console.log('exit event from server fired')
	})
})
```

### emergency
in case of emergency, do ```npm install --force```