
# Clean non-checked-in files.
clean:
	@rm -rf node_modules

# Install dependencies from npm.
node_modules: package.json
	@npm install

# Run the tests.
test: node_modules
	@node_modules/.bin/mocha \
		test/index \
			--reporter spec \
			--timeout 10000 \
			--bail

# Phony targets.
.PHONY: clean
.PHONY: test