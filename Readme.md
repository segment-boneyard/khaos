# Khaos

  A super-simple way to generate directory or file templates.

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

                name: kasmld
         description: wido
               owner: nqwww
             scripts? (y/n) n
              styles? (y/n) y
           templates? (y/n) y
    
        Generated <name>.