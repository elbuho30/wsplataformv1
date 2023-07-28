var fs = require("fs");
var path = require("path");
var RSVP = require("rsvp");
var thousandFormat = require("../Helpers/thousandFormat.js");

//rpt.fontSize(9);

function generate(dataR, dataRequest) {
    // Here is a sample Fax Report
    /* globals Report, pipeStream, displayReport, faxImg */

    var promise = new RSVP.Promise(function (resolve, reject) {

    // Cache today's date
    
    var Report = require("fluentreports").Report;

    // This is your routine that gets run any time a header needs to be printed.
    var header = function (rpt, data) {



        rpt.fontNormal();

    
        rpt.newLine();
        rpt.band([
            {
                data: 'Periodo Interes (Dias): ',
                width: 100
            },
            {
                data: data.periodoDias,
                width: 200,
                align: "left"
            },
           
            {
                data: 'Destinos: ',
                width: 100
            },
            {
                data: data.Destino,
                width: 200,
                align: "left"
            },
           
   
        ]);
        rpt.newLine();
            if (dataR[0].CAPITALIZA === 1){            
                        rpt.band([
            {
                data: 'Capitalización: ',
                width: 100
            },
            {
                data: "SI",
                width: 200,
                align: "left"
            }, {
                data: 'Plazo:',
                width: 100
            },
            {
                data: data.plazo,
                width: 200,
                align: "left"
            }
                             ]);
            }else 
                         rpt.band([
            {
                data: 'Capitalización: ',
                width: 100
            },
            {
                data: "NO",
                width: 200,
                align: "left"
            }, {
                data: 'Plazo:',
                width: 100
            },
            {
                data: data.plazo,
                width: 200,
                align: "left"
            }
                             ]);   
      
        rpt.newLine();

        var propertyFilter = [
            {
                prop: "NRO"
             }, {
                prop: "CAPITAL",
                format: true
             }, {
                prop: "INTERES_GANADO",
                format: true
             }, {
                prop: "INTERES_PAGADO",
                format: true
             }, {
                prop: "RETEFUENTE",
                format: true
             }
         ];



        rpt.fontBold();
        rpt.band([
            {
                data: 'Nro',
                width: 100
          },
            {
                data: 'Capital',
                width: 100
          },
            {
                data: 'Interés Ganado',
                width: 100
          },
            {
                data: 'Interés Pagado',
                width: 100
          },
            {
                data: 'Retefuente',
                width: 100
          }
      ], {
            border: 1,
            width: 0
        });

        rpt.fontNormal();

        var nro = 1;
        for (var i in dataR) {

            var output = [];
            nro++;

            for (var prop in propertyFilter) {
                output.push({
                    data: propertyFilter[prop].format ? thousandFormat(dataR[i][propertyFilter[prop].prop]) : dataR[i][propertyFilter[prop].prop],
                    width: 100,
                    align: 1,
                });

            }

            rpt.band(output, {
                border: 1,
                width: 0
            });




            if (nro === 30) {
                rpt.newPage(false);
                nro = 1;
            }

        }

    };

    // Create a new Report Engine
    // pipeStream is predefined in this report to make it display in the browser
    var rpt = new Report(path.join(__dirname, "../../../temp/myreportSimuladorAhorro.pdf"));

    // Configure the Defaults
    rpt
        .margins(40)
        .header(header, {
            pageBreakBefore: true
        })
       // .data(JSON.parse(dataRequest.objeto));
       .data((dataRequest));

        // Run the Report
        // displayReport is predefined to make it display in the browser
        rpt.render(function (err, reportName) {
            if (err) return reject(err);
            var stream = fs.createReadStream(reportName);
            resolve(stream);
        });



    });


    return promise;
}

module.exports = generate;