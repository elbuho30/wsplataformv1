var nodemailer = require('nodemailer');

module.exports = function (globalOp) {
    
    var transporter = nodemailer.createTransport(globalOp);

    return {
        sendMail: function (options, fn) {
            options.from = globalOp.auth.user;
            transporter.sendMail(options, fn);
            
        }
    }

}
