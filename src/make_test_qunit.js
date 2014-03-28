/* make_test_qunit.js */

function make_test_qunit (page) {
	return page.evaluate(function () {
		return document.getElementById('qunit-testresult') ? true : false ;
	});
}

function make_test_qunit_result () {
	return document.getElementById('qunit-testresult').innerText;
}

function make_test_poll (page) {
	var result = page.evaluate(make_test_qunit_result);
	if (result.match(/^Running/)) {
		return 'wait';
	} else if (result.match(/^Tests completed/)) {
		return 'pass';
	} else {
		return 'fail';
	}
}
