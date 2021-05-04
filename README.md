# lit-migration
## What is this
This is a codemod that helps you to migrate a codebase from `lit-element` or `lit-html` to `lit`.
Take a look at the [official migration guide](https://github.com/lit/lit/wiki/Lit-2.0-Upgrade-Guide) to get a full overwiew of what needs to be done to migrate your codebase to `lit`.

## Example usage
````
npx jscodeshift -t lit-migration.js __testfixtures__/ --extensions=ts --parser=ts
````
For more options type `jscodeshift --help` or head over to the [jscodeshift repo](https://github.com/facebook/jscodeshift).

## What `lit-migration` does
- It changes all `lit-element` and `lit-html` import statements to import from `lit`
- It renames all occurrences of renamed Lit-APIs
  - see [all renamed APIs](https://github.com/lit/lit/wiki/Lit-2.0-Upgrade-Guide#update-to-renamed-apis)

## `lit-migration` does NOT
- turn your directives into class based directives
- offer customization for formatting. Run your code formatter after using this tool.

## Contributing
There are probably usages of `lit` that were not considered.
Feel free to open issues or file PRs.

### References
- https://github.com/lit/lit/wiki/Lit-2.0-Upgrade-Guide
- https://www.toptal.com/javascript/write-code-to-rewrite-your-code
- https://github.com/facebook/jscodeshift
