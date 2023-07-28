
var env = process.env.NODE_ENV || 'production',
    express = require('express'),
    swig = require('ejs'),
    middlewares = require('./middlewares/admin'),
    path = require("path"),
    apiRoute = require("./routes/api.js");

var ExpressServer = function (config) {

    config = config || {};
    this.expressServer = express();
    for (var middleware in middlewares) {
        this.expressServer.use(middlewares[middleware]);
    }
    
    this.expressServer.set('view engine', 'ejs');
    this.expressServer.set('views', __dirname + '/negocio/vistas/plantallas/');
    this.expressServer.use("/api", apiRoute);
};
module.exports = ExpressServer;