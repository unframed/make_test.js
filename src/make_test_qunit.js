function qunit_result () {
	var result = document.getElementById('qunit-testresult');
	if (result) {
		return result.innerText;
	} else {
		return 'Not a Qunit test page';
	}
}

function qunit_poll (page) {
	var result = page.evaluate(qunit_result);
	if (result.match(/^Running/)) {
		return 'wait';
	} else if (result.match(/, 0 failed[.]$/m)) {
		return 'pass';
	} else {
		console.log(result);
		return 'fail';
	}
}

make_test_run(qunit_poll);