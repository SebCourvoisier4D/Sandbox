/*jslint unparam: true*/
'use strict';

// this module is meant to be used as a singleton
var Sandbox = function Sandbox() {
    var express = require('express'),
        app = express(),
        httpServer = require('http').Server(app),
        path = require('path'),
        osenv = require('osenv'),
        serveIndex = require('serve-index'),
        httpServerRunning = false,
        logger,
        self = this;

    self.setLogger = function (the_logger) {
        self.logger = the_logger;
    };

    self.log = function () {
        if (self.logger) {
            self.logger.info.apply(self.logger, arguments);
        } else {
            console.log.apply(console, arguments);
        }
    };

    self.startHttpServer = function (destination, port) {
        if (destination === undefined) {
            destination = osenv.home();
        }
        if (port === undefined) {
            port = 8080;
        }
        if (httpServerRunning === false) {
            httpServerRunning = true;
            app.use('/', express.static(path.normalize(destination), {
                maxAge: 0
            }));
            app.use('/sandbox-browse', serveIndex(path.normalize(destination), {
                'icons': true,
                'view': 'details'
            }));
            httpServer.listen(port);
            self.log('HTTP server running on port', port, 'and publishing', destination);
        }
        return self;
    };

    self.stopHttpServer = function () {
        if (httpServerRunning === true) {
            httpServerRunning = false;
            httpServer.close();
            self.log('HTTP server closed');
        }
        return self;
    };

    app.use(function noCachePlease(req, res, next) {
        res.header("Cache-Control", "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");
        res.header("Pragma", "no-cache");
        res.header("Expires", -1);
        next();
    });
};

Sandbox.instance = null;

Sandbox.getInstance = function () {
    if (this.instance === null) {
        this.instance = new Sandbox();
    }
    return this.instance;
};

module.exports = Sandbox.getInstance();
