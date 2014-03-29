make_test.js
===
[![Build Status](https://travis-ci.org/unframed/make_test.js.png)](https://travis-ci.org/unframed/make_test.js)

A practical JavaScript project prototype.

It provides a simple directory structure and some boilerplate to `make` a new project that manage dependencies with `wget` or `git`, compiles sources with `uglifyjs`, load `qunit` test pages in a `phantomjs` headless browser and continuously integrate with [Travis](https://travis-ci.org/).

Synopsis
---
Clone this repository as your next JavaScript component project, for instance `src/pro.js`, then move to the newly created directory:

~~~
git clone https://github.com/unframed/make_test.js ~/src/pro.js
cd ~/src/pro.js 
~~~

### make install

Make sure `wget`, `git`, `nodejs`, `npm`, `uglifyjs` and `phantomjs` are installed. Your mileage may vary, but on Debian Sid it may be as simple as:

~~~
make install
~~~

Note that `make install` will also create a `deps` directory.

### make new

You may now: reinitialise the project's repository; keep the `.travis.yml` configuration and the `test_qunit.html` test page; set a prototype `Makefile`; remove `make_test.js`'s README, LICENCE sources and dependencies; then add the new project resources to repository in a first commit.

~~~
make new
~~~

Your brand new `src/pro.js` repository is ready to be pushed to Github, registered in Travis and continuously integrated.

Let's see how it will be made in its [`Makefile`](src/Makefile.in).

### make

The first and default `make` target is `test`:

~~~Makefile
test: ugly
    phantom.js deps/make_test.js/run_qunit.js test
~~~

The default target will load any HTML pages found in `test` and wait for `qunit` test completion using the default timeout of 3 seconds and a default poll interval of 100ms.

See [test/qunit_test.html](test/qunit_test.html) for a sample test page.

### make ugly

The `ugly` target compiles JavaScript sources, if any.

For a new project, `ugly` simply depends on `pull`.

~~~Makefile
ugly: pull
~~~

See the [`Makefile`](Makefile) of `make_test.js` itself for an example of linting and compiling ordered sources into a beautified script:

~~~Makefile
ugly: pull
    uglifyjs \
        src/make_test_run.js \
        src/make_test_qunit.js \
        -o run_qunit.js \
        -b --lint
~~~

Making sources "ugly" is an understatement as [mishoo's gem](https://github.com/mishoo/UglifyJS2) can lint, compile, compress, mangle or beautify and enclose JavaScript sources with a wealth of options.

### make pull

To fetch and update dependencies, `make` the `pull` target.

When dependencies are dynamic, like a git repository master branch, then the `pull` target should not be empty:

~~~Makefile
pull: deps
    cd deps/make_test.js && git pull origin
~~~

If all dependencies are statics, specific versions of resources, the `pull` is equivalent to `deps`.

~~~Makefile
pull: deps
~~~

### make deps

Dependencies may be git repositories.

~~~Makefile
deps: deps/make_test.js

deps/makes_test.js:
    git clone https://github.com/unframed/make_test.js deps/make_test.js
~~~

Or they may be versions of a resource, like test assets:

~~~Makefile
deps: test/qunit-1.14.0.js test/qunit-1.14.0.css

CDNJS_AJAX_LIBS = http://cdnjs.cloudflare.com/ajax/libs

test/qunit-1.14.0.js:
    wget "${CDNJS_AJAX_LIBS}/qunit/1.14.0/qunit.js" \
    -O "test/qunit-1.14.0.js"

test/qunit-1.14.0.css:
    wget "${CDNJS_AJAX_LIBS}/qunit/1.14.0/qunit.css" \
    -O "test/qunit-1.14.0.css"
~~~

Note that they are stored where test assets belong, in the `test` directory. 

Also, to pull dependencies, you may use any other source repository software as long as there is a command line equivalent in effect to `git pull` (like `svn checkout`).

### make clean

A clean project is one without dependencies:

~~~Makefile
clean:
    rm deps/* -rf
~~~

By convention, all other resources are expected to be added to the project repository, including assets and builds.

Use Case
---
Continuous integration of components into a web applications.

For web components the relevant automated test environment is a headless browser. So there is no actual need to commit support to `nodejs` toolchain(s) beyond `uglifyjs`.

Using only `make` and a small set of common open source tools, project created with this prototype can integrate with other projects in a wider variety of programming languages.
