test: ugly
	phantomjs make_test.js

ugly: deps
	uglifyjs \
		src/make_test_run.js \
		src/make_test_qunit.js \
		-b --lint > make_test.js

deps: deps/qunit-1.14.0.js deps/qunit-1.14.0.css

CDNJS_AJAX_LIBS = http://cdnjs.cloudflare.com/ajax/libs

deps/qunit-1.14.0.js:
	wget "${CDNJS_AJAX_LIBS}/qunit/1.14.0/qunit.js" -O "deps/qunit-1.14.0.js"

deps/qunit-1.14.0.css:
	wget "${CDNJS_AJAX_LIBS}/qunit/1.14.0/qunit.css" -O "deps/qunit-1.14.0.css"

pull: deps