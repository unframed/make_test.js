/* make_test.js 

Synopsis
---
Test one HTML page, check every 100 milliseconds for completion,
times out after 3 seconds:

~~~
phantomjs make_test.js test.html 3000 100 
~~~

Test all HTML pages in the `test` directory with the default timeout
per page (3s) and check interval (100ms):

~~~
phantomjs make_test.js test
~~~

*/

var fs = require('fs'),
	webpage = require('webpage'),
	system = require('system');

function listAbsolutePaths (directory) {
	return fs.list(directory).map(function (path) {
		return directory + fs.separator + path;
	});
}

function isFileHTML (path) {
	return fs.isFile(path) && path.match(/^.+[.]html$/);
}

var directory = fs.workingDirectory + fs.separator + 'test',
	urls = listAbsolutePaths(directory).filter(isFileHTML),
	timeleft = parseInt(system.args[1] || '3000'), 
	interval = parseInt(system.args[2] || '100'), 
	url, page;

function make_test_wait () {
	timeleft = timeleft - interval;
	var state = make_test_poll(page) 
	switch (state) {
		case 'wait':
			if (timeleft > 0) {
				setTimeout(make_test_wait, interval);
			} else {
				console.log("make_test.js timeout: " + url);
				phantom.exit(2);
			}
			break;
		case 'pass':
			console.log("make_test.js pass: " + url);
			if (urls.length > 0) {
				make_test_loop();
			} else {
				phantom.exit(0);
			}
			break;
		case 'fail':
			console.log("make_test.js fail: " + url);
			phantom.exit(1);
			break;
		default:
			console.log("make_test.js invalid state: " + state + " in " + url);
			phantom.exit(4);
	}
}

function make_test_loaded (status) {
	if (status === 'success') {
		setTimeout(make_test_wait, interval);
	} else {
		console.log("failed to open: " + url);
		phantom.exit(3);
	}
}

function make_test_loop () {
	url = urls.shift();
	page = webpage.create();
	page.open(url, make_test_loaded);
}

if (urls) {
	make_test_loop();
} else {
	phantom.exit(0); // nothing to test
}