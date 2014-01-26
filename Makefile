
clean:
	@rm -rf node_modules

node_modules: package.json
	@npm install
	@touch package.json

test: node_modules
	@./node_modules/.bin/mocha --reporter spec

.PHONY: clean test