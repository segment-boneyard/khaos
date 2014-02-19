
# Khaos

  A super-simple way to generate directory or file templates.

  Thank you so much to [Sorella](https://github.com/robotlolita) for letting us use the `khaos` name on npm!

## Example

  It looks for templates in `~/.khaos`, so say you had a template like this:
  
    ~/.khaos/
      component/
        component.json
        index.js
        Makefile
        Readme.md
  
  Where each of those files can have arbitrary handlebars-style template tags (eg. `{{name}}`). When you run the command:
  
    $ khaos component <name>
  
  Khaos will prompt you for all of the variables needed to fill in your templates and then generate the filled-in version in `<name>`:

                name: ware
         description: Easily create your own middleware layer.
               owner: segmentio
    
        Generated "ware".
  
  That's all there is too it really. You can also use handdlebars-style conditionals (eg. `{{#bool}}`) inside your templates, or at the start of a file's name to make certain files conditional. Khaos will ask you for simple boolean confirmation. For example for a template like:
  
    ~/.khaos/
      component/
        component.json
        {{#scripts}}index.js
        {{#styles}}index.css
  
  Khaos would ask:
  
                name: ware
         description: Easily create your own middleware layer.
               owner: segmentio
             scripts? (y/n) y
              styles? (y/n) n
              
        Generated "ware".

  And the `index.css` file wouldn't be generated.
