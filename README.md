# Behavior Driven Development CLI Generator

## Introduction

Given a yaml file defining commands with a particular syntax, generates a cli program.

## Contents

-   [Introduction](#introduction)
-   [Contents](#contents)
-   [Installation](#installation)
-   [Usage](#usage)

## Installation

```shell
// With yarn
yarn add @mithray/bdd-cligen

// With npm
npm i @mithray/bdd-cligen
```

## Usage

There are two steps to using this tool.

1. Using the `bdd-cligen` module
2. Writing a yaml file that defines your own API

### Using the bdd-cligen module

This is the main executable and should be placed in the `./bin` directory of your node project. The variable `program` is a [commander](https://www.npmjs.com/package/commander) object.

```javascript
#!/usr/bin/env node

const cligen = require('@mithray/bdd-cligen')
cligen({ path: './api.yml' }).then(program => {
    program.parse(process.argv)
})
```

### Writing a yaml file

The yaml program specifies options defining the interface of your functions. Not all of these are necessary to generate the cli, but they could be used by other programs such as an integration with JSDoc andmocha testing. `bdd-cligen` only requires you to define the variables `description`, `function`, `parameter_desc` for every function. Testing might suggest the `path_prefix` also needs to be defined, and the root parent of the tests also must be called `api`.

```yaml
---
path_prefix: 'lib'

api:
    someFunc:
        description: 'A description of your function to appear in Help files'
        function: 'nameOfFunction'
        parameter_desc: '{string} [someString="This yaml property has JSDoc syntax"]'
        tests:
            - parameters: { someString: 'A description of various tests' }
              condition: 'should have property "api"'
            - parameters: >
                  {
                      someString: 'These descriptions will be used to generate BDD tests using mochajs and should.js',
                  }
              condition: 'should have property "api"'
```

Note, the `tests` property will not actually be used, but it is likely to be helpful for future integrations. These test descriptions will be used to generate BDD tests using mochajs and should.js. The syntax of the condition property is like that of should.js, except that it has dots converted to spaces and function calls converted to quotes.
