module.exports = {
    enviarmail: enviarmail   
  }

function enviarmail(directionEmail, subject, messageBody, Archivo) {
    var email = require("../../smpt-mail");
    var config = require("../../config.json");
    if (Archivo != undefined) {
        var config1 = {
            smtpHost: config.emailConfig.host,
            smtpUser: config.emailConfig.user,
            smtpPass: config.emailConfig.pass,
            from: config.emailConfig.Remitente,
            to: directionEmail,
            subject: subject,
            htmlStr: messageBody,
            port: config.emailConfig.port,
            secure: config.emailConfig.secure,
            esrele:  config.emailConfig.esrele,
            attachments: {
                path: Archivo
            },
            htmlContext: {
                user: {
                    name: "tsq"
                }
            }
        };
    } else {
        var config1 = {
            smtpHost: config.emailConfig.host,
            smtpUser: config.emailConfig.user,
            smtpPass: config.emailConfig.pass,
            from: config.emailConfig.Remitente,
            to: directionEmail,
            subject: subject,
            htmlStr: messageBody,
            port: config.emailConfig.port,
            secure: config.emailConfig.secure,
            esrele:  config.emailConfig.esrele,
            htmlContext: {
                user: {
                    name: "tsq"
                }
            }
        };
    }

    email(config1, function (err, result) {
        console.log(err, result);
    });
}