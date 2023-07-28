// var fs = require('fs'),
//   http = require('http')

// var http = require('http'),
// 	conf = require('./config.json'),
// 	expressServer = require('./app/ExpressServer.js'),
//    app = new expressServer(),
//    server = http.createServer(app.expressServer),
//    port = process.env.PORT || conf.HttpPort;

// server.listen(port);
// console.log('ejecutando ' + port);

var fs = require("fs"),
    http = require("http");

var https = require("https"),
    conf = require("./config.json"),
    expressServer = require("./app/ExpressServer.js"),
    app = new expressServer();

try {
    if (conf.ssl.use) {
        var privateKey = fs.readFileSync(
            "./ssl/cpio/privkey1.key",
            "utf8"
        );

        var certificate = fs.readFileSync(
            "./ssl/cpio/cert1.crt",
            "utf8"
        );

        var ca1 = fs.readFileSync(
            "./ssl/cpio/fullchain1.crt",
            "utf8"
        );
        var ca2 = fs.readFileSync(
            "./ssl/cpio/fullchain1.crt",
            "utf8"
        );

        var credentials = {
            key: privateKey,
            cert: certificate,
            ca: [ca1, ca2]
        };

        (server = https.createServer(credentials, app.expressServer)), (port =
            process.env.PORT || conf.HttpPort);
    } else {
        (server = http.createServer(app.expressServer)), (port =
            process.env.PORT || conf.HttpPort);
    }

    server.listen(port);
    console.log("ejecutando " + port);
} catch (error) {
    console.log(error);
}
