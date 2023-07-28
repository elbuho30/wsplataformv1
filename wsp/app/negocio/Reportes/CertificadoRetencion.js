var fs = require("fs");
var path = require("path");
var RSVP = require("rsvp");
fontSize: 10;
function generate(data, dataR) {
    // Here is a sample Fax Report
    /* globals Report, pipeStream, displayReport, faxImg */

    // Cache today's date

    var promise = new RSVP.Promise(function(resolve, reject) {
        var Report = require("fluentreports").Report;

        var Current_Date = new Date().toDateString();

        // Interesting Data Structure, but we can still use it.
        // This is your routine that gets run any time a header needs to be printed.
        var header = function(rpt, data) {
            rpt.image("./imagen/LogoEntidad.PNG");

            rpt.print(dataR["#ENTIDAD#"], {
                align: "center",
                fontSize: 10,
                fontBold: true
            });
            rpt.print("NIT:" + dataR["nit"], {
                align: "center",
                fontSize: 10,
                fontBold: true
            });
            rpt.newLine(1);

            rpt.print(
                "CERTIFICADO ANUAL DE RETENCION EN LA FUENTE E INFORMACION ADICIONAL",
                {
                    fontSize: 10,
                    align: "center",
                    fontBold: true
                }
            );
            rpt.newLine(1);

            rpt.band([
                {
                    data: "Oficina: ",
                    width: 60,
                    fontSize: 10
                },
                {
                    data: data.nombreagencia,
                    width: 230,
                    align: "left",
                    fontSize: 10
                },

                {
                    data: "Tipo de identificación: ",
                    width: 120,
                    fontSize: 10
                },
                {
                    data: data.tipoidentIFicacion,
                    width: 150,
                    align: "left",
                    fontSize: 10
                }
            ]);

            rpt.band([
                {
                    data: "Nombre: ",
                    width: 60,
                    fontSize: 10
                },
                {
                    data: data["nombre"],
                    width: 230,
                    align: "left",
                    fontSize: 10,
                    fontBold: true
                },

                {
                    data: "No. Identificación: ",
                    width: 120,
                    fontSize: 10
                },
                {
                    data: data.cedulasociado,
                    width: 150,
                    align: "left",
                    fontSize: 10,
                    fontBold: true
                }
            ]);

            rpt.band([
                {
                    data: "Fecha de expedición: ",
                    width: 100,
                    fontSize: 10
                },
                {
                    data: dataR["fechatrabajo"],
                    width: 270,
                    align: "left",
                    fontSize: 10
                }
            ]);

            rpt.band([
                {
                    data: "Año gravable: ",
                    width: 100,
                    fontSize: 10
                },
                {
                    data: dataR["año"],
                    width: 270,
                    align: "left",
                    fontSize: 10
                }
            ]);

            rpt.newLine(2);

            rpt.band([
                {
                    data: "Producto: ",
                    width: 400,
                    fontSize: 10
                },
                {
                    data: "Ahorros",
                    width: 200,
                    align: "left",
                    fontSize: 10
                }
            ]);

            rpt.band([
                {
                    data: "Ahorros a la vista",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.saldo_av,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);
            rpt.band([
                {
                    data: "Ahorros permanente",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.saldo_ap,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);

            rpt.band([
                {
                    data: "Ahorros contractual",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.saldo_ac,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);
            rpt.band([
                {
                    data: "CDAT",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.saldo_at,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);
            rpt.band([
                {
                    data: "Saldo a Diciembre 31",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.saldo_31_ahorros,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);

            rpt.newLine(1);

            rpt.band([
                {
                    data: "Producto:",
                    width: 400,
                    fontSize: 10
                },
                {
                    data: "Aportes",
                    width: 200,
                    align: "left",
                    fontSize: 10
                }
            ]);
            rpt.band([
                {
                    data: "Saldo a Diciembre 31",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.saldo_po,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);

            rpt.band([
                {
                    data: "Revalorización",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.saldo_rev,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);

            rpt.newLine(1);

            rpt.band([
                {
                    data: "Producto: ",
                    width: 400,
                    fontSize: 10
                },
                {
                    data: "Cartera",
                    width: 200,
                    align: "left",
                    fontSize: 10
                }
            ]);

            rpt.band([
                {
                    data: "Saldo de crédito",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.saldo_cr,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);

            rpt.band([
                {
                    data: "Intereses pagados por vivienda ",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.INTeres_viv,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);
            rpt.band([
                {
                    data: "Intereses pagados por otros créditos",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.INTeres_cr,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);

            rpt.newLine(1);

            rpt.band([
                {
                    data: "Intereses pagados o abonados en cuenta:",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.INTeres_ah,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);

            rpt.band([
                {
                    data: "Base retención:",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.base,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);
            rpt.band([
                {
                    data: "Retención en la fuente:",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.retencion,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);

            rpt.newLine(1);

            rpt.band([
                {
                    data:
                        "Componente inflacionario de los rendimientos financieros",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.componente,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);
            rpt.band([
                {
                    data:
                        "Ingreso no constitutivo de la renta ni ganancia ocasional",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.ingreso,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);
            rpt.newLine(1);
            rpt.band([
                {
                    data: "Base GMF:",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.base_gmf,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);
            rpt.band([
                {
                    data: "Valor GMF:",
                    width: 410,
                    fontSize: 10
                },
                {
                    data: data.gmf_aso,
                    width: 80,
                    align: "right",
                    fontSize: 10
                }
            ]);

            rpt.newPage(true);

            if (fs.existsSync("./imagen/LogoEntidad.PNG")) {
                imgLoc = "./imagen/LogoEntidad.PNG";
                rpt.image(imgLoc);
            } else {
                rpt.print("No se pudo encontrar la imagen");
            }

            rpt.newLine(4);

            rpt.print("Recibe _____________________________________,", {
                fontSize: 10
            });
            rpt.print("Nombre y apellido: " + data["nombre"], {
                fontSize: 10
            });
            rpt.print("Identificación: " + data["cedulasociado"], {
                fontSize: 10
            });

            rpt.newLine(4);

            rpt.print(
                "Este certificado no requiere firma autógrafa por expedirse por medio de computador ",
                {
                    align: "center",
                    fontSize: 10
                }
            );

            rpt.print("según el artículo 10 del decreto 836 de 1991. ", {
                align: "center",
                fontSize: 10
            });

            rpt.newLine(2);

            rpt.print(
                "No constituye renta ni ganancia ocasional por el año gravable " +
                    dataR["año"] +
                    " " +
                    data.componente +
                    "  % " +
                    " del valor de los rendimientos financieros percibidos por personas naturales y " +
                    " sucesiones ilíquidas, no obligadas a llevar libros de contabilidad, de conformidad " +
                    "con lo previsto en los artículos 38, 40-1 y 41  del estatuto tributario ",
                {
                    align: "justify",
                    fontSize: 10
                }
            );

            rpt.newLine(20);

            rpt.print(
                "Dirección: " +
                    dataR["direccion"] +
                    "," +
                    data["nombreagencia"],
                {
                    align: "center",
                    fontSize: 10
                }
            );
            rpt.print("PBX: " + dataR["telefono"] + " - Fax: ", {
                align: "center",
                fontSize: 10
            });
            rpt.print(
                "E-mail: " + dataR["email"] + " - Web: www.canaprooc.com.co",
                {
                    align: "center",
                    fontSize: 10
                }
            );
        };

        // And this is the function that runs anytime a footer needs to get run.
        var footer = function(rpt) {
            rpt.print(["This material is for the intended recipient."], {
                fontBold: true,
                fontSize: 10,
                y: 740
            });
        };

        // Create a new Report Engine
        // pipeStream is predefined in this report to make it display in the browser
        var rpt = new Report(
            path.join(__dirname, "../../../temp/myreportRetencion.pdf")
        );

        // Configure the Defaults
        rpt.margins(55).header(header).data(data);

        // Run the Report
        // displayReport is predefined to make it display in the browser
        rpt.render(function(err, reportName) {
            if (err) return reject(err);
            var stream = fs.createReadStream(reportName);
            resolve(stream);
        });
    });

    return promise;
    // Run the Report
    // displayReport is predefined to make it display in the browser
}

module.exports = generate;
