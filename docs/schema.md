
# Schema

When building Khaos templates, you have the ability to define the schema for all of the possible inputs. Though not required, providing a schema can yield a more pleasant and consistent user experience.

## Object

Note that the schema here is a JavaScript Object that is used when prompting the user for the names to be used in the scaffolding process. This is an example of a schema object:

```javascript
{
  name: 'string',
  siblings: 'number',
  deceased: 'boolean',
  secret: 'password'
}
```

..which will generate this prompt:

```
    name: andy
    siblings: 0
    deceased: (y/N) N
    secret:
```

Khaos uses [`prompt-for`](https://github.com/segmentio/prompt-for) to prompt the user on the command line for inputs. The schema object is [passed directly](https://github.com/segmentio/khaos/blob/682ee9a29bc0fa0d73aa51a821de94e13e5c70bc/lib/index.js#L215) to the  `prompt-for` module.

You can pass more complex objects such as:

```javascript
{
  name: {
    label: 'What\'s your name?',
    hint: 'e.g. Steve Brule'
    required: true
  },
  url: {
    label: 'What is the URL?',
    required: true
  }
  twitter: {
    label: 'If you want to link your Twitter, what\'s your username?'
  }
}
```

More information about schema objects can be found at the [`prompt-for` repo](https://github.com/segmentio/prompt-for).

## Usage

With the JavaScript API, you can just pass the schema object as such:

```javascript
var template = resolve('../path/to/template');
var schema = require('../path/to/schema.json');

var khaos = new Khaos(template)
  .schema(schema);
```

More information [here](/docs/api.md#schemaschema).