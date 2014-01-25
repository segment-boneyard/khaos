
mocha = ./node_modules/.bin/mocha

clean:
	@rm -rf node_modules

node_modules: package.json
	@npm install
	@touch package.json

test: node_modules
	@$(mocha) --reporter spec --slow 400

.PHONY: clean test