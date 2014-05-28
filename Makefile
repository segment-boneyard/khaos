
clean:
	@rm -rf node_modules

node_modules: package.json
	@npm install

test: node_modules
	@node_modules/.bin/mocha test/cli.js --reporter spec --timeout 10000

.PHONY: clean test