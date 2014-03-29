var fs = require('fs'),
	webpage = require('webpage'),
	system = require('system'),
	make_test_script = system.args[0],
	make_test_name = system.args[1] || 'test',
	make_test_timeout = parseInt(system.args[2] || '3000'),
	make_test_interval = parseInt(system.args[3] || '100');

function make_test_urls (name) {
	function listAbsolutePaths () {
		if (fs.isFile(name)) {
			return [name];
		} else {
			return fs.list(name).map(function (path) {
				return name + fs.separator + path;
			});
		}
	}
	function isFileHTML (path) {
		return fs.isFile(path) && path.match(/^.+[.]html$/);
	}
	return listAbsolutePaths(name).filter(isFileHTML);
}

function make_test_run (make_test_poll, urls) {
	var timeleft = make_test_timeout, url, page;
	if (urls === undefined) {
		urls = make_test_urls(fs.workingDirectory + fs.separator + make_test_name);
	}
	function make_test_wait () {
		timeleft = timeleft - make_test_interval;
		var state = make_test_poll(page); 
		switch (state) {
			case 'wait':
				if (timeleft > 0) {
					setTimeout(make_test_wait, make_test_interval);
				} else {
					console.log("timeout: " + url);
					phantom.exit(2);
				}
				break;
			case 'pass':
				console.log("pass: " + url);
				if (urls.length > 0) {
					make_test_loop();
				} else {
					phantom.exit(0);
				}
				break;
			case 'fail':
				console.log("fail: " + url);
				phantom.exit(1);
				break;
			default:
				console.log("invalid state: " + state + " in " + url);
				phantom.exit(4);
		}
	}
	function make_test_loaded (status) {
		if (status === 'success') {
			setTimeout(make_test_wait, make_test_interval);
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
}
