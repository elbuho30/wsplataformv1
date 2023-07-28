var fs = require("fs");
var path = require("path");

function log(flag, content) {

    var str = typeof content === "string" ? content : JSON.stringify(content, null, 4);

    fs
        .appendFile(path.join(__dirname, "../../../message.txt"), "\n\n" + flag + str,
            function (err) {
                if (err) console.log(err);
            });


}
module.exports = log;
