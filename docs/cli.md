
# CLI

The CLI is an easy way to scaffold projects quickly. There are only four commands.

### `#create <template> <project>`

This command creates a new directory based on a provided template. The `<template>` can either be local:

```
$ khaos create <path/to/template> <project-name>
```

..or from GitHub:

```
$ khaos create <github-org/github-repo> <project-name>
```

The `<project-name>` will be the name of the new directory that is created.

### `install <template> [<name>]`

This command installs a `<template>` from GitHub locally to be named as `<name>`. Here's an example:

```
$ khaos install segmentio/khaos-node node

   khaos · Saved "segmentio/khaos-node" as "node"!
   khaos · Run `khaos create node <project>` to get started.
```

### `list`

This command lists all the templates you have installed locally via Khaos.

```
$ khaos list

   khaos · app
   khaos · keku
   khaos · node
```

### `update <template>`

This command updates the locally installed `<template>`. It'll pull the most recent template from GitHub and save that locally under the same name.

```
$ khaos update node

   khaos · Updated the local "node" template.

```

### Options

For all commands, you can also pass optional flags `-d` (`--directory`), which will tell Khaos where to look for templates.

