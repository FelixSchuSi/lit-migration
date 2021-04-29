# lit-migration

## Example usage

````
jscodeshift -t index.ts cli-test/ --extensions=ts --parser=ts
````
For more options type `jscodeshift --help` or head over to [jscodeshift repo](https://github.com/facebook/jscodeshift).

### references
- https://github.com/lit/lit/wiki/Lit-2.0-Upgrade-Guide
- https://www.toptal.com/javascript/write-code-to-rewrite-your-code
- https://github.com/facebook/jscodeshift
- https://github.com/facebook/jscodeshift#unit-testing

### Stategy
1. Adjust names for renamed apis (in import statement and sourcecode itself) https://github.com/lit/lit/wiki/Lit-2.0-Upgrade-Guide#update-to-renamed-apis
2. Move decorators to separate imports and remove the named import from the original import statement (Remove complete import statement if there are no named imports left)
    - `lit-element` -> `lit/decorators.js`
3. Rename import declaration for directives (`lit-html/directives/repeat.js` -> `lit/directives/repeat.js`)
4. Rename `lit-element` to `lit`

### Things to look out for
- Are there imports of `lit-element` and `lit-html` that are not referencing the index module?
  - as in `lit-html/directives/repeat.js`
- Make sure type only imports and regular imports dont get mixed up
- Are file extensions used in imports?