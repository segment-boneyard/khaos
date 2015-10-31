
![](https://cldup.com/ed89zMzGj2.png)

> The simplest project scaffolder. [http://khaos.io](http://khaos.io)

[![Build Status](https://travis-ci.org/segmentio/khaos.svg)](https://travis-ci.org/segmentio/khaos)

## Installation

    $ npm install -g khaos

## Documentation

- [Creating Templates](/docs/templates.md)
- [Using the JavaScript API](/docs/api.md)

## Usage

The quickest way to start using Khaos is to create a new project from a template on GitHub. For example, using the [segmentio/khaos-node](https://github.com/segmentio/khaos-node) template...

    $ khaos create segmentio/khaos-node my-new-project

...that will prompt you to fill in some placeholders...

                name: ware
               owner: segmentio
         description: Easily create your own middleware layer.

...and voilà! Your new node.js project directory is created including a `package.json`, `Readme.md`, `Makefile`, and everything.

## Local Usage

Khaos can also use local templates at `~/.khaos` and there's a simple command for download GitHub repositories there. Here's the same example from above, but locally...

    $ khaos install segmentio/khaos-node node

That installs Segment's node template and aliases it as `node`, so then from now on you can easily...

    $ khaos create node my-new-project

...and fill out a few fields and your new project directory is created!

## How does it work?

Khaos templates are just plain old directories where any file or filename can have [**handlebars placeholders**](http://handlebarsjs.com/). When you create a new project, Khaos will scan the template for placeholders and prompt you to fill in a value for each one.

For example, say you have a `package.json` in your template...

```js
{
  "name": "{{ name }}",
  "repository": "{{ owner }}/{{ name }}",
  "description": "{{ description }}",
  "dependencies": {}
}
```

Khaos sees that and knows to prompt you for a `name`, `owner`, and `description` when generating the template, like so...

                name: ware
               owner: segmentio
         description: Easily create your own middleware layer.

You can use handlebars conditional blocks too, so if you wanted to add an optional private flag...

```js
{
  "name": "{{ name }}",
  {{#private}}
  "private": true,
  {{/private}}
  "repository": "{{ owner }}/{{ name }}",
  "description": "{{ description }}",
  "dependencies": {}
}
```

...and Khaos is smart enough to know that `private` is a boolean when it prompts you...

                name: ware
             private: (y/n) y
               owner: segmentio
         description: Easily create your own middleware layer.

What's cool about all this is it makes creating new templates incredibly easy. Just copy an existing project and replace the filled-in values with placeholders... now you can automate more things!

## Examples

To give you an idea for what's possible, check out a few examples:

  - [A template for node projects.](https://github.com/segmentio/khaos-node) Pretty basic.
  - [A template for react.js projects.](https://github.com/lapwinglabs/khaos-react)
  - [A template for JSTransformer.](https://github.com/jstransformers/khaos-jstransformer)
  - [A template for building Deku components.](https://github.com/stevenmiller888/khaos-deku-component)
  - [A CLI that uses the Javascript API internally.](https://github.com/logo/cli/blob/master/bin/logo-create) Featuring custom plugins.

## Javascript API

In addition to using the simple CLI to create new projects, you can use Khaos straight from node.js in case you want to bake it into your own, more custom, scaffolding process. Checkout the [logo creation CLI](https://github.com/logo/cli/blob/master/bin/logo-create) for an example of this in action.

#### new Khaos(src, dest)

Create a new Khaos instance with a `src` template directory, and that will output to a `dest` directory.

#### #run(callback)
  
Run the prompting and scaffolding process and then `callback(err)`.

#### #use(plugin)
  
Use a custom `plugin` function. Khaos uses [Metalsmith](http://metalsmith.io) internally, so the plugin is just a regular Metalsmith plugin, and all of the prompted answers are available as global metadata.

## Thanks!

_Thank you so much to [Sorella](https://github.com/robotlolita) for letting us use the `khaos` name on npm!_

## License (MIT)

Copyright &copy; 2013, Segment.io &lt;friends@segment.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
