var sql = require('mssql');
var path = require("path");
var soap = require('soap')
var fs = require("fs");
var log = require("../negocio/Helpers/log.js");
// var queryCorreo = "select rtrim(ltrim(servidorsaliente)) as servidorsaliente,rtrim(ltrim(puerto)) as puerto,rtrim(ltrim(usuario)) as usuario,rtrim(ltrim(CONVERT(VARCHAR(300), DECRYPTBYPASSPHRASE(DBO.Fc_ReturnSpecialKey(),contrasena)))) as contrasena,rtrim(ltrim(ssl)) as ssl from CorreosalienteOpaMovil";
var config = require("../../config.json");
var api = require("../routes/api.js");
var ejecutarservicio = require("../routes/servicessoari.js")





function connect(config) {
    var connection = new sql.Connection(config);

    return connection
        .connect()
        .then(function () {
            var request = new sql.Request(connection);

            request
                .query("Select TOP 1 1 as Fine")
                .then(log.bind(null, "Success"))
                .catch(log.bind(null, "Error"));

            function SP(params, SPname) {
                // var connection = new sql.Connection(config);
                var request = new sql.Request(connection);
                for (var i in params) {
                    request.input(i, params[i]);
                }
                return request.execute(SPname);
            }

            function consulta(params, SPname) {

                var request = new sql.Request(connection);
                for (var i in params) {
                    request.input(i, params[i]);
                }
                return request.query(SPname);
            }

            return {
                SP: SP,
                consulta: consulta,
            }

        }).catch(log.bind(null, "Error"));
}

module.exports = {
    connect: connect,
    log: log
};



