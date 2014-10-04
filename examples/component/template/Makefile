
build: components
	@component build --dev

clean:
	@rm -rf {{#node}}node_modules {{/node}}build components

components: component.json
	@component install --dev{{#node}}

node_modules: package.json
	@npm install{{/node}}

test: {{#node}}node_modules {{/node}}build{{#node}}
  @./node_modules/.bin/mocha --reporter spec{{/node}}
  @component test phantom

.PHONY: clean test