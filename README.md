# Behavior Driven Development CLI Generator

Given a yaml file defining commands with a particular syntax, generates a cli program.

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
            - parameters:
                  {
                      someString: 'These descriptions will be used to generate BDD tests using mochajs and should.js',
                  }
              condition: 'should have property "api"'
            - parameters:
                  { someString: 'different tests to test the named function' }
              condition: 'should have property "api"'
            - parameters:
                  {
                      someString: 'The syntax of the condition property is like that of should.js, ',
                  }
              condition: 'should have property "api"'
            - parameters:
                  {
                      someString: 'except that it has dots converted to spaces and function calls converted to quotes',
                  }
              condition: 'should have property "api"'
```
# bdd-cligen
# bdd-cligen
