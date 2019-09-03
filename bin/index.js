#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const changeCase = require('change-case')
const log = require('@mithray/logger')
const fs = require('fs')
const yaml = require('yaml')
const readPkgUp = require('read-pkg-up')

function parseParamDescriptions(descriptions) {
    let desc_arr = []
    for (let desc in descriptions) {
        desc = descriptions[desc]
        let desc_obj = {
            type: desc.replace(/.*{(.*?)}.*/, '$1').trim(),
            name: desc.replace(/.*\[(.*?)=(.*)\].*/, '$1').trim(),
            default: desc.replace(/.*\[(.*)=['"]+(.*)['"]+\].*/, '$2').trim()
        }
        desc_arr.push(desc_obj)
    }

    return desc_arr
}

function describeCommand(command) {
    let func = path.join(
        __dirname,
        '..',
        command.path_prefix,
        command.function + '.js'
    )
    let name = changeCase.paramCase(command.function)
    let description = command.description.toLowerCase()
    let param_arr = []
    let param_descs = command.parameter_desc
    param_arr.push(param_descs)
    param_arr = param_arr.flat()
    param_descs = param_arr

    param_descs = parseParamDescriptions(param_descs)

    if (description.startsWith('should')) {
        description = description.substring(7)
    }
    description = changeCase.sentenceCase(description)
    return { param_descs, name, description, func }
}

async function loadCommands(options) {
    const yaml_file_data = fs.readFileSync(options.path, 'utf8')
    const spec = await yaml.parse(yaml_file_data)

    const path_prefix = spec.path_prefix
    for (let command in spec.api) {
        command = spec.api[command]
        command.path_prefix = path_prefix
        let { param_descs, name, description, func } = describeCommand(command)
        try {
            func = require(func)
        } catch {
            console.log('failed to load function: ' + func)
        }

        program
            .command(name)
            .description(description)
            .option(
                '--no-pretty',
                'Will print stringified objects instead of colorized yaml'
            )
            .action(async options => {
                let res = await func(options)
                if (typeof res === 'object' && options.pretty) {
                    console.log(res)
                } else {
                    console.log(res)
                }
            })

        for (let param in param_descs) {
            let idx = program.commands.findIndex(function(o) {
                return o._name === name
            })
            param = param_descs[param]
            param_name = changeCase.paramCase(param.name)
            program.commands[idx].option(
                '--' + param_name + ' <' + param_name + '>',
                param.name + ' default value is ' + param.default
            )
        }
    }

    const config = await readPkgUp(path.dirname(options.path))

    program.name(config.package.name)
    program.version(config.package.version)

    return program
}

module.exports = loadCommands

loadCommands({ path: './api.yml' }).then(pro => {
    pro.parse(process.argv)
})
