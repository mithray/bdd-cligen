#!/usr/bin/env node

const cligen = require('../index.js')
cligen({ path: './api.yml' }).then(program => {
    program.parse(process.argv)
})
