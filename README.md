make_test.js
===
A practical JavaScript project prototype.

It provides a template repository to: `make` a project, manage dependencies with `wget` and `git`; uglify sources; run `qunit` or any other HTML test page in a `phantomjs` headless browser; continuously integrate with `travis`.

Fork it, then depend on it to test whatever `make` can build, continuously.

Synopsis
---
Make sure `make`, `wget`, `git`, `nodejs`, `uglifyjs` and `phantomjs` are installed.

On Debian Sid it may be as simple as:

~~~
sudo apt-get make wget git nodejs phantomjs
sudo npm install uglify-js -g
~~~

Clone this repository as your next JavaScript project, change directory to this new `pro.js` directory, delete then reinitialise the local `.git` respository.

~~~
git clone https://github.com/laurentszyster/make_test.js pro.js
cd pro.js
rm -rf .git
git init
~~~

Then adapt the `Makefile` provided to build your project.

### test

The first and default `make` target is `test`:

~~~Makefile
test: ugly
    phantom.js make_test.js test
~~~

It applies itself to load any HTML pages found in `test` and wait for test completion using the default timeout and poll interval.

Note that `test` depends on `ugly`.

### ugly

The `ugly` target compiles and minify JavaScript sources using `uglifyjs`:

~~~Makefile
ugly: pull
    uglifyjs \
        src/make_test_run.js \
        src/make_test_qunit.js \
        -o make_test.js \
        -b
~~~

The `ugly` target depends on `pull`.

### pull

To fetch and update dependencies, `make` the `pull` target.

If all dependencies are statics, specific versions of resources, the `pull` is equivalent to `deps`.

~~~Makefile
pull: deps
~~~

When dependencies are dynamic, like a git repository master branch, then the `pull` target is not empty:

~~~Makefile
pull: deps
    cd deps/make_test.js && git pull origin
~~~

In both case, it depends on `deps`.

### deps

Dependencies may be precise versions of a library:

~~~Makefile
deps: deps/qunit-1.14.0.js deps/qunit-1.14.0.css

CDNJS_AJAX_LIBS = http://cdnjs.cloudflare.com/ajax/libs

deps/qunit-1.14.0.js:
    wget "${CDNJS_AJAX_LIBS}/qunit/1.14.0/qunit.js" \
    -O "deps/qunit-1.14.0.js"

deps/qunit-1.14.0.css:
    wget "${CDNJS_AJAX_LIBS}/qunit/1.14.0/qunit.css" \
    -O "deps/qunit-1.14.0.css"
~~~

Dependencies may also be git repositories.

~~~Makefile
test:
    phantomjs deps/make_test.js/make_test.js 

deps: deps/make_test.js

deps/makes_test.js:
    git clone https://laurentszyster/make_test.js deps/make_test.js
~~~

Note that you can use any other source repository software as long as there is a command line equivalent to `git pull` (`svn checkout` for instance).

By convention projects repositories should include distributable resources, usually minified sources.

Also by convention, the dependency tree should be flat, made of what web applications should be made of in the first place: orthogonal components.