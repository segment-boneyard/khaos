
# Binaries.
mocha = ./node_modules/.bin/mocha \
	--require gnode \
	--require co-mocha \
	--reporter spec \
	--timeout 5000 \
	--slow 500 \
	--bail

# Install dependencies from npm.
node_modules: package.json
	@npm install
	@touch node_modules

# Run the tests.
test: node_modules
	@$(mocha)

# Run the tests in debug mode.
test-debug: node_modules
	@$(mocha) debug

# Phony targets.
.PHONY: test
.PHONY: test-debug