#!/bin/sh
':' //; exec "$(command -v nodejs --use-strict || command -v node --use-strict)" "$0" "$@"

var program = require('commander'),
    packageData = require('../package.json'),
    commands = require('./commands');

// Set version
program.version(packageData.version);

// Setup 'start' command
commands.start(program);

// Parse inputs
program.parse(process.argv);
