
# JavaScript API

In addition to using the simple [CLI](/docs/cli.md) to scaffhold new projects quickly from the command line, you can also use the Khaos [Javascript API](/docs/api.md) for more advanced use cases.

If you have your own CLI, the Javascript API makes it super trivial to implement your own `cli create` method for scaffolding your own projects. Checkout the [logo creation CLI](https://github.com/logo/cli/blob/master/bin/logo-create) for an example of this in action.

#### `new Khaos(template)`

```js
var khaos = new Khaos('path/to/template');
```

Create a new Khaos instance, passing a path to the `template` directory (or file).

#### `#generate(destination, [answers])`

```js
khaos.generate('path/to/destination', function(err){
  if (err) throw err;
  console.log('Generated!');
});

yield khaos.generate('path/to/destination');
```

A top-level convenience method that will `read` and `write` all in one go. If you omit `answers`, it will also `parse` and `prompt` before writing. _Can be `yield`ed._

#### `#read()`

```js
khaos.read(function(err, files){
  if (err) throw err;
  ...
});

var files = yield khaos.read();
```

Read the template directory files from disk. _Can be `yield`ed._

#### `#parse(files)`

```js
khaos.parse(files, function(err, schema){
  if (err) throw err;
  ...
});

var schema = yield khaos.parse(files);
```

Parse out a schema from a dictionary of template `files`. This is a [Metalsmith](http://metalsmith.io) `files` object. _Can be `yield`ed._

#### `#prompt(schema)`

```js
khaos.prompt(schema, function(err, answers){
  if (err) throw err;
  ...
});

var answers = yield khaos.prompt(schema);
```

Prompt the user for answers to all of the keys in a `schema`. _Can be `yield`ed._

#### `#write(destination, files, answers)`

```js
khaos.write('path/to/destination', files, answers, function(err){
  if (err) throw err;
  ...
});

yield write('path/to/destination', files, answers);
```

Template a dictionary of `files` with an `answers` dictionary, and write the results to a `destination` directory (or file). _Can be `yield`ed._

#### `#use(plugin)`

```js
khaos.use(plugin);

function plugin(khaos) {
  khaos.schema({ name: { type: 'string' } });
}
```
  
Use a custom `plugin` function, which will be called with the `khaos` instance.

#### `#before(plugin)`

```js
khaos.before(plugin);

function plugin(files, metalsmith) {
  for (var key in files) {
    var file = files[key];
    if (file.ignore) delete files[key];
  }
}
```

Add a `plugin` function to be run on the `before` hook. The `before` hook is run before any of the files are written to disk. This would be the hook to use if you want to manipulate the user's answers or the generated files before they are written to disk.

The `plugin` function is just a [Metalsmith](https://metalsmith.io) plugin that will be passed a `files` object and a `metalsmith` instance.

#### `#after(plugin)`

```js
khaos.after(deploy);
```

Add a `plugin` function to be run on the `after` hook. The `after` hook is run after the files are written to disk. This would be the hook to use if you wanted to copy the files to another location, or perform build-process related tasks.

The `plugin` function is just a [Metalsmith](https://metalsmith.io) plugin that will be passed a `files` object and a `metalsmith` instance.

#### `#format(options)`

```js
khaos.format({
  color: 'red',
  prefix: '  something  '
}); 
```

Pass in an `options` object to set the format for prompting. Options takes three properties: `color`, `separator`, and `prefix`. Since Khaos uses `prompt-for`, more information about the `options` can be found in the [source](https://github.com/segmentio/prompt-for/blob/master/lib/types.js#L115-L117).

```javascript
{
  color: 'blue',
  separator: ': ',
  prefix:
}
```

#### `#schema(schema)`

```js
khaos.schema({
  name: { type: 'string' },
  age: { type: 'number' },
  cheese: { type: 'boolean' }
});
```

Pass in a `schema` object. See the [Schema docs](/docs/schema.md) for more information.

#### `#order(array)`

```js
khaos.order(['age', 'name', 'cheese']);
```

Set the order to prompt for answers in by passing an `array` of schema keys.

#### `#helpers(helpers)`

```js
khaos.helpers({
  'markdown': marked,
  'case': toCase
});
```

Pass in a dictionary of Handlebars `helpers` to template with.
