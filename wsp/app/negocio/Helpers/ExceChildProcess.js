//var RSVP = require('rsvp');
var Q = require("q"),
    log = require("./log.js"),
    exec = require('child_process').exec;



function execc(file, params) {

    //var promise = new RSVP.Promise(function (resolve, reject) {
    var promise = Q.Promise(function (resolve, reject) {

        var arrayParams = "";
        for (var i in params) {
            //if (i === 1) {
            //arrayParams += " " + JSON.stringify(JSON.parse(params[i]));
            //else {
            arrayParams += " " + params[i];
            //}
        }
        var paramettersJSON = JSON.stringify(arrayParams);
        paramettersJSON = paramettersJSON.substr(1, paramettersJSON.length - 2);
        console.log(paramettersJSON + " -->params");
        log("SendTo Simulador", paramettersJSON);

        /// post
        //var arrayParams = "";
        //        var arrayParams = "";
        //        for (var i in params) {
        //            if (typeof params[i] === "object") {
        //                arrayParams += " " + JSON.stringify(params[i]);
        //            } else {
        //                arrayParams += " " + params[i];
        //            }
        //        }
        //console.log(arrayParams);
        /// post
        exec(file + "" + paramettersJSON, function (error, stdout, stderr) {
            //exec(file + " " + arrayParams, function (error, stdout, stderr) {
            if (stderr)
                return reject(stderr);
                 console.log(stdout);

            var obj = JSON.parse(stdout);
            log("Ouput Simulador", obj);
            resolve(obj);
              
        });
    });
    return promise;
}

module.exports = execc;