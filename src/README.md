make_test.js/src
===
The sources of `make_test_run.js` and `make_test_qunit.js` are compiled into a single `run_qunit.js` script.

Synopsis
---
Load all HTML pages found in `test` and poll them for Qunit test result:

~~~
phantomjs deps/make_test.js/run_qunit.js 
~~~

The script will: load every HTML pages found in the default `test` directory or exit on the first fail; check every 100 milliseconds for `qunit` completion, times out after 3 seconds (for each pages) and exit with an error on the first timeout; exit with an error on first test failure; or exit with no error if all page loaded and all tests passed.

### Qunit Test



### Extend

You may apply `make_test_run` and do something completely different for the pages loaded and polled.

Functions in `make_test_run.js` implement a test runner that loads pages sequentially, start to poll the current page at interval and either timeout, pass or fail.

~~~javascript
make_test_run(poll, urls);
~~~

