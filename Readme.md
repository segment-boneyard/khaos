# Khaos

  A super-simple way to generate directory or file templates.

## Example

  It looks for "templates" in `~/.khaos`, so say you had a template like this:
  
    ~/.khaos/
      component/
        khaos.json
        component.json
        index.js
        index.css
        index.html
        Makefile
        Readme.md
  
  You can generate this template with the command:
  
    $ khaos component <name>
    
  Which will create a new folder named `<name>`. It will first read `khaos.json` for prompt you for each of the keys in there, filling in your answers into every template file.
