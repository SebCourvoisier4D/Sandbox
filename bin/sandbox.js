#! /usr/bin/env node

/*jslint unparam: true*/
'use strict';

var Sandbox = require('../'),
    log4js = require('log4js'),
    logger,
    numeral = require('numeral'),
    moment = require('moment'),
    util = require('util'),
    cli_args = process.argv.slice(2),
    destination,
    port;

if (cli_args.length === 2) {
    destination = cli_args[0];
    port = parseInt(cli_args[1], 10);
} else if (cli_args.length === 1) {
    if (/^\d+$/.test(cli_args[0])) {
        port = parseInt(cli_args[0], 10);
    } else {
        destination = cli_args[0];
    }
}

log4js.replaceConsole();
log4js.configure({
    appenders: [{
        type: 'console',
        category: 'sandbox'
    }]
});
logger = log4js.getLogger('sandbox');

process.on('uncaughtException', function (err) {
    logger.fatal((new Date()).toUTCString() + ' uncaughtException:', err.message);
    logger.fatal(err.stack);
    process.exit(1);
});

Sandbox.setLogger(logger);

Sandbox.startHttpServer(destination, port);
