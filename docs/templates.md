
# Templates

Khaos is a scaffolding tool where one of the arguments or inputs is the base template. This section describes how to create a template for Khaos.

Let's use [this template](https://github.com/segmentio/khaos-node) for creating a node module as an example.

## Structure

Everything that will be scaffolded into the destination directory must be in the template's `./template` folder:

```
.
├── template
│   └── <stuff>
├── History.md
└── Readme.md
```

Everything on the same level as `./template` won't be used by Khaos.

Inside the [`./template`](https://github.com/segmentio/khaos-node/tree/master/template) directory is the actual template / seed / boilerplate of what you want in the destination directory. The only difference is adding [handlebars](http://handlebarsjs.com/) templating and logic.

Note that the handlebars can go _anywhere_. You can see it in the README.md:

![](https://cloudup.com/crXZg7RgjeF+)

## Usage

With JavaScript:

```
var template = resolve('../path/to/template');
var schema = require('../path/to/schema.json');

var khaos = new Khaos(template)
  .schema(schema);
```

With CLI:

```
$ khaos create <path/to/template> new-project
```

..or, with GitHub..

```
$ khaos create <github-org/github-repo> new-project
```

