test: ugly
	phantomjs run_qunit.js
	phantomjs run_qunit.js test
	phantomjs run_qunit.js test/qunit_test.html

ugly: pull
	uglifyjs \
		src/make_test_run.js \
		src/make_test_qunit.js \
		-b --lint > run_qunit.js

pull: deps

deps: test/qunit-1.14.0.js test/qunit-1.14.0.css

CDNJS_AJAX_LIBS = http://cdnjs.cloudflare.com/ajax/libs

test/qunit-1.14.0.js:
	wget "${CDNJS_AJAX_LIBS}/qunit/1.14.0/qunit.js" -O "test/qunit-1.14.0.js"

test/qunit-1.14.0.css:
	wget "${CDNJS_AJAX_LIBS}/qunit/1.14.0/qunit.css" -O "test/qunit-1.14.0.css"

install:
	sudo apt-get install wget git nodejs phantomjs
	npm install uglify-js

clean:
	rm run_qunit.js -f

new: clean
	mv src/Makefile.in Makefile
	rm src/*
	rm README.md -f
	rm LICENCE.txt -f
	rm .git -rf
	touch README.md
	git init
	git add .gitignore
	git add .travis.yml
	git add Makefile
	git add README.md
	git add test/*
	git commit -m "first commit"
