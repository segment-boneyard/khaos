
# Khaos: Javascript API

In addition to using the simple [CLI](/docs/cli.md) to scaffhold new projects quickly from the command line, you can also use the Khaos Javascript API for more advanced use cases.

If you have your own CLI, the Javascript API makes it super trivial to implement your own `cli create` method for scaffolding your own projects. Checkout the [logo creation CLI](/logo/cli/tree/master/bin/logo-create) for an example of this in action.

#### `new Khaos(template)`

Create a new Khaos instance, passing a path to the `template` directory (or file).

#### #generate(destination, [answers])

A top-level convenience method that will `read` and `write` all in one go. If you omit `answers`, it will also `parse` and `prompt` before writing. _Can be `yield`ed._

#### #read()

Read the template directory files from disk. _Can be `yield`ed._

#### #parse(files)

Parse out a schema from a dictionary of template `files`. This is a [Metalsmith](http://metalsmith.io) `files` object. _Can be `yield`ed._

#### #prompt(schema)

Prompt the user for answers to all of the keys in a `schema`. _Can be `yield`ed._

#### #write(destination, files, answers)

Template a dictionary of `files` with an `answers` dictionary, and write the results to a `destination` directory (or file). _Can be `yield`ed._

#### #use(plugin)
  
Use a custom `plugin` function, which will be called with the `khaos` instance.

#### #before(plugin)

Add a `plugin` function to be run on the `before` hook. The `before` hook is run before any of the files are written to disk. This would be the hook to use if you want to manipulate the user's answers or the generated files before they are written to disk.

The `plugin` function is just a [Metalsmith](https://metalsmith.io) plugin that will be passed a `files` object and a `metalsmith` instance.

#### #after(plugin)

Add a `plugin` function to be run on the `after` hook. The `after` hook is run after the files are written to disk. This would be the hook to use if you wanted to copy the files to another location, or perform build-process related tasks.

The `plugin` function is just a [Metalsmith](https://metalsmith.io) plugin that will be passed a `files` object and a `metalsmith` instance.

#### #format(options)

Pass in an `options` object to set the format for prompting. See the [Format docs](/docs/config#format.md) for more information.

#### #schema(schema)

Pass in a `schema` object. See the [Schema docs](/docs/config#schema.md) for more information.

#### #order(array)

Set the order to prompt for answers in by passing an `array` of schema keys.

#### #helpers(helpers)

Pass in a dictionary of Handlebars `helpers` to template with. See the [Helpers docs](/docs/config#helpers.md) for more information.
