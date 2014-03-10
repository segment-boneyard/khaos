
# Khaos

  A super-simple way to scaffold new projects.

## Installation

    $ npm install -g khaos

## Usage

  The easiest way to use Khaos is to create a new project from a template on GitHub, for example using the [segmentio/khaos-node]() template...

    $ khaos segmentio/khaos-node my-new-project

  That will prompt you to fill in some placeholders...

                name: ware
               owner: segmentio
         description: Easily create your own middleware layer.

  ...and voilà! Your new directory is made.

## How does it work?

  Khaos templates are just plain old directories where any file or filename can have handlebars placeholders. And whenever you create a new project, Khaos will scan the template for placeholders and prompt you to fill in a value for each one.

  For example maybe you have a `package.json` in your template...

```js
{
  "name": "{{ name }}",
  "repository": "{{ owner }}/{{ name }}",
  "description": "{{ description }}",
  "dependencies": {}
}
```

  Khaos reads that and knows it will need to prompt you for a `name`, `owner` and `description` when creating a new project from your template, like so...

                name: ware
               owner: segmentio
         description: Easily create your own middleware layer.

  And you can use handlebars-style `if/else` blocks too, so say you wanted to add an optional entry for testing...

```js
{
  "name": "{{ name }}",
  "repository": "{{ owner }}/{{ name }}",
  "description": "{{ description }}",
  {{#tests}}
  "devDependencies": {
    "mocha": "1.x"
  },
  {{/tests}}
  "dependencies": {}
}
```

  Khaos is smart enough to know that the `tests` placeholder is a boolean:

                name: ware
               owner: segmentio
         description: Easily create your own middleware layer.
               tests: (y/n) y

  What's cool about all this is that it means creating new templates is incredibly easy to do. You just copy one of your existing projects and replace the current values with placeholders! So now you can automate a lot more things...

## Examples

  To give you an idea for what's possible, check out a few existing templates:

  - [A template for node projects.](/segmentio/khaos-node) Pretty basic.
  - [A template for component projects.](/segmentio/khaos-component) Featuring conditional blocks and conditional files!
  - [A CLI that uses the Javascript API internally.](/logo/cli/tree/master/bin/logo-create) Featuring custom plugins.

## Local Templates

  Khaos will also look for local templates in the `~/.khaos` directory. Here's an example using the same template as above, but locally...

    $ mkdir ~/.khaos
    $ git clone git://github.com/segmentio/khaos-node.git ~/.khaos/node

  That clones Segment.io's node template as simply `node`, so then you can...

    $ khaos node my-new-project

  ...and boom! Project created.

## Javascript API

  You can use Khaos straight from node in case you want to bake it into your own, more custom, scaffolding process. Checkout the [logo creation CLI](/logo/cli/tree/master/bin/logo-create) for an example of this in action.

### new Khaos(src, dest)

  Create a new Khaos instance with a `src` template directory, and that will output to a `dest` directory.

### #run(fn)
  
  Run the prompting and scaffolding process and then callback `fn(err)`.

### #use(plugin)
  
  Use a custom `plugin` function. Khaos uses [Metalsmith](http://metalsmith.io) internally, so the plugin will be called with the same format that a regular Metalsmith plugin would be. And all of the prompted answers are available as global metadata. 

## Thanks

  _Thank you so much to [Sorella](https://github.com/robotlolita) for letting us use the `khaos` name on npm!__

## License

The MIT License (MIT)

Copyright &copy; 2013, Segment.io \<friends@segment.io\>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.