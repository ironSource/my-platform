# myappscloud-platform
Provides OS platform specific functionality to myappscloud-lib and myappscloud-service.
currently supports OSX and Windows

This module builds on top of [node-windows](https://github.com/coreybutler/node-windows) and [node-mac](https://github.com/coreybutler/node-mac)

## API
This module exposes a unified api implemented differently for each OS

### createServer(connectionListener, startedListener)
Creates a server that will receive connections from a client created using connect() (See below)
On OSX this will be a normal TCP server, on Windows it will use a named pipe.

```javascript
var platform = require('myappscloud-platform')

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
var platform = require('myappscloud-platform')

platform.connect(function (err, client) {
	if (err) {
		return console.log('ahhhhhhhhhh!', err)
	}

	client.data(['event', 'app', '1234', 'exit'], function () {
		console.log('exit event from server fired')
	})
})
```

### Service(config)
export an os specific Service class that exposes methods to install, uninstall, start and stop an operating system service

```javascript
var platform = require('myappscloud-platform')

var service = new platform.Service({ ... config ... })

service.install()
```

for service configuration options and full api, see [node-windows#Service](https://github.com/coreybutler/node-windows#windows-services) and [node-mac#Overview](https://github.com/coreybutler/node-mac#overview)

### launch(app) and launchElevated(app)
launches a child process, this process is detached from the parent and thus will not prevent the parent from existing when the event loop as no more calls in it. On windows the elevated process is lauched using a special executable (see [here](https://github.com/coreybutler/node-windows#elevate)) and on osx it is launched the same way as one would do "sudo ..."

```javascript
var platform = require('myappscloud-platform')

var child = platform.launch({ command: 'ls', args: ['-la']})
child.stdout.on('data', function (data) {
	console.log(data.toString())
})

```

### emergency
in case of emergency, do ```npm install --force```