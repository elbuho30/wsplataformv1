const { async } = require("q")


module.exports = {
    Soari: Soari,
    backup: backup,
    Balance: Balance,
    mandarwhatenbloque:mandarwhatenbloque
}



function mandarwhatenbloque(entidad) {

    var sql = require("../model/mssql.js")
    var configuracion = require("../routes/entidadesconfiguracion.js")

    var config = configuracion.entidadesconfiguracion(entidad)

    sql.connect(config).then(function (model) {
        var request = require('request');


    var cadena = "select * from ClientesPasantias where evento = 'Analfe'"
    model.consulta("", cadena)
        .then(function (data) {

            var inicio = (data.length == 0 ? 1 : 0)
            var fin =  data.length


           while (inicio >= 0 && inicio < fin) {
            enviarwhatsapp("Muchas gracias por registrarte en nuestra plataforma Nekkosoft-Soari. El sorteo ya fue realizado y pondrás visualizar los resultados en nuestro Instagram " +
            "https://instagram.com/nekkosoft?igshid=YmMyMTA2M2Y=",data[inicio].celular.substring(0,12))
            




            inicio ++
           }


        })
        .catch(function (err) {
            console.dir(err);
            var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
            sql.log("Error", message);
        });

    })
}


function enviarwhatsapp(message, number) {
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }

    var request = require('request');
    var options = {
        url: 'http://localhost:3021/send?message=' + message + '&to=' + number,
        method: 'POST',
        JSON: true,
        headers: headers,
        rejectUnauthorized: false,
    }

    request(options, function (error, response, body) {
        var prueba = body;
    });



}



function Balance(entidad, ano, mes) {

    var sql = require("../model/mssql.js")
    var configuracion = require("../routes/entidadesconfiguracion.js")

    var config = configuracion.entidadesconfiguracion(entidad)

    sql.connect(config).then(function (model) {
        var request = require('request');


        var headers = {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/json'


        }



        var optionToken = {
            url: config.url + 'auth/Authorization/Authorization',
            method: 'POST',
            JSON: true,
            headers: headers,
            rejectUnauthorized: false,
            body: JSON.stringify({ userName: config.userName, password: config.ClaveEntidad })

        }
        // www.soari.co:80
        //Step 3 - do the request

        //  enviarwhatsapp()
        request(optionToken, function (error, response, body) {


            var data = JSON.parse(body);
            var Token = data.token
            var headers = {
                'User-Agent': 'Super Agent/0.0.1',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Token

            }

            var cadena = "select intid,numerocuenta from tblcuentasbalance where numerocuenta in ('1','2')"
            model.consulta("", cadena)
                .then(function (data) {

                    var inicio = (data.length == 0 ? 1 : 0)
                    var fin =  data.length


                   while (inicio >= 0 && inicio < fin) {

                        // let MONTH = 0
                        // leta no = 2019
                        //    var  iniciomeses = 0
                        //     var finmeses = 34
                        //     while (iniciomeses >= 0 && iniciomeses <= finmeses) {
                        //         MONTH = MONTH + 1
                        //         if (MONTH == 12 || MONTH == 24) {
                        //             ano = ano + 1
                        //             MONTH = 0
                        //         }  

                        var optionsbalance = {
                            url: config.url + 'api/risksystems/Soari/Balance',
                            method: 'POST',
                            JSON: true,
                            headers: headers,
                            rejectUnauthorized: false,
                            body: JSON.stringify({
                                codigoCuentas: [
                                    data[inicio].numerocuenta
                                ],
                                saldosMayores: 0,
                                anio: parseInt(ano),
                                mes: parseInt(mes)
                            }

                            )
                        }

                  
                        //Step 3 - do the request
                        request(optionsbalance, function (error, response, body) {

                            if (!error && response.statusCode == 200) {
                                var databalance = JSON.parse(body);
                                databalance = databalance.object


                             

                                if (databalance.length != 0) {

                                    // if (databalance[0].codigoCuenta == "2" ) {
                                    //     var ptueba =   databalance[0].codigoCuenta
                                    //       }

                                    var parametro = {
                                        codigoCuenta: databalance[0].codigoCuenta,
                                        fechaCorte: databalance[0].fechaCorte,
                                        nombreCuenta: databalance[0].nombreCuenta.trim(),
                                        saldoCuenta: databalance[0].saldoCuenta.toString(),
                                        ano: ano,
                                        mes: mes


                                    }

                                    model.SP(parametro, 'REGISTRARBALANCEMENSUAL')
                                        .then(function (data1) {

                                            console.log(data1);

                                        })
                                        .catch(function (err) {
                                            console.dir(err);
                                            var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                            sql.log("Error", message);
                                        });

                                }

                                // else {

                                //         isertarseguimientoeventos("ConsultarDatosBalanace", 0, "no trajo datos")

                                //     }

                            } else {
                                var errordeconexion = ""
                                if (error != null) {
                                    errordeconexion = error.message
                                } else {
                                    errordeconexion = response.statusCode + ' ' + response.statusMessage
                                }
                                // isertarseguimientoeventos("ConsultarDatosBalanace", 0, errordeconexion)

                            }



                        })
                        //     iniciomeses ++
                        // }
                        inicio++


                    }
                })
                .catch(function (err) {
                    console.dir(err);
                    var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                    sql.log("Error", message);
                })
        })
    })
}





function backup(entidad) {

    var sql = require("../model/mssql.js")
    envio = {}
    var configuracion = require("../routes/entidadesconfiguracion.js")
    var config = configuracion.entidadesconfiguracion(entidad)
    sql.connect(config).then(function (model) {
        model.SP("", 'BD_BackUpdetodasEnti')
            .then(function (recordsets) {
                console.log(recordsets);
            })
            .catch(function (err) {
                console.dir(err);
                var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                sql.log("Error", message);
            });

    })
}


function Soari(entidad) {
    var moment = require("moment");
    var enviarmail = require("../routes/enviarmail.js");
    var enviarsms = require("../routes/enviarsms.js");
    var sql = require("../model/mssql.js")

    var configuracion = require("../routes/entidadesconfiguracion.js")

    var config = configuracion.entidadesconfiguracion(entidad)

    sql.connect(config).then(function (model) {
        var request = require('request');
        //----este while es para traer las entidades y recorrerlas 
        var headers = {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/json'


        }

        var optionToken = {
            url: config.url + 'auth/Authorization/Authorization',
            method: 'POST',
            JSON: true,
            headers: headers,
            rejectUnauthorized: false,
            body: JSON.stringify({ userName: config.userName, password: config.ClaveEntidad })

        }
        // www.soari.co:80
        //Step 3 - do the request

        //  enviarwhatsapp()
        request(optionToken, function (error, response, body) {

            if (body === undefined) {

                var errordeconexion = ""
                if (error != null) {
                    errordeconexion = error.message
                } else {
                    errordeconexion = response.statusCode + ' ' + response.statusMessage
                }

                var message = 'Buenos dias, la Entidad: ' + config.binding + ' No tiene conexión a soapi, por favor verifique...'
                isertarseguimientoeventos("No tiene conexion", 0, errordeconexion)
                console.log(message);
                enviarwhatsapp(message, '573195274902');
                enviarwhatsapp(message, '573015373882');

            }
            else {

                // Send a request

                var data = JSON.parse(body);
                var Token = data.token

                //   consultaraportes()
                var empieza = 0
                var cuantos = 1
                var request = require('request');
                while (empieza >= 0 && empieza < cuantos) {
                    //Step 1 - Set the headers
                    var headers = {
                        'User-Agent': 'Super Agent/0.0.1',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + Token

                    }


                    //Step 2 - Configure the request
                    var optionsAsociados = {
                        url: config.url + 'api/risksystems/Soari/Asociados',
                        method: 'POST',
                        JSON: true,
                        headers: headers,
                        rejectUnauthorized: false,
                        body: JSON.stringify({ desdeFechaIngreso: "1900-06-30T17:20:55.515Z" })
                    }

                     
                    //  ConsultarTransaccionesENBLOQUE(headers, entidad)
                    //     return
                    // www.soari.co:80
                    //Step 3 - do the request
                    request(optionsAsociados, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var data1 = JSON.parse(body);
                            isertarseguimientoeventos("ConsultarDatosAsociados", data1.object.length, response.statusCode)
                            var jsonAsociados = []

                            jsonAsociados.json = JSON.stringify(data1)
                     
// var empieza = 0

// while (  empieza >= 0 && empieza <  data1.object.length)

// {
// if (data1.object[empieza].cedulaAsociado =='1017211529')

//     {

// var prueba= 0

//     }
//     empieza ++;

// }





                            model.SP(jsonAsociados, 'S_sp_datosasociados')
                                .then(function (recordsets) {
                                    console.log(recordsets);

                                   consultaraportes(headers)
                                   consultarAhorrosAlaVista(headers)
                                   consultarAhorrosContractual(headers)
                                   ConsultarDatosTermino(headers)
                                   ConsultarDatosPermanente(headers)
                                   ConsultarDatoscreditos(headers)
                                    ConsultarDatosNovedades(headers)
                                  ConsultarTransacciones(headers, entidad)
                                    notificacionfrecuenciamonitoreo()

                                })
                                .catch(function (err) {
                                    console.dir(err);
                                    var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                    sql.log("Error", message);
                                });

                            // if (empiezaasociados == cuantosasociados) {









                            // }


                        } else {

                            var errordeconexion = ""
                            if (error != null) {
                                errordeconexion = error.message
                            } else {
                                errordeconexion = response.statusCode + ' ' + response.statusMessage
                            }


                            isertarseguimientoeventos("ConsultarDatosAsociados", 0, errordeconexion)
                        }


                    });
                    empieza++
                }
            }
        });




        function consultaraportes(headers) {


            var optionsAportes = {
                url: config.url + 'api/risksystems/Soari/Aporte',
                method: 'POST',
                JSON: true,
                headers: headers,
                rejectUnauthorized: false,
                body: JSON.stringify({ saldosMayores: 0 })
            }

            //Step 3 - do the request
            request(optionsAportes, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var dataoptionsAportes = JSON.parse(body);

                    var envioAportes = []
                    envioAportes.json = JSON.stringify(dataoptionsAportes)
                    dataoptionsAportes = dataoptionsAportes.object

                    var cuantosasociados = dataoptionsAportes.length
                    isertarseguimientoeventos("ConsultarDatosPortes", cuantosasociados, response.statusCode)


                    if (dataoptionsAportes.length > 0) {
                        model.SP(envioAportes, 'S_sp_datosAportes')
                            .then(function (recordsets) {
                                console.log(recordsets);
                            })
                            .catch(function (err) {
                                console.dir(err);
                                var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                sql.log("Error", message);
                            });
                    } else {
                        console.log(dataoptionsAportes.length);

                    }




                } else {

                    var errordeconexion = ""
                    if (error != null) {
                        errordeconexion = error.message
                    } else {
                        errordeconexion = response.statusCode + ' ' + response.statusMessage
                    }


                    isertarseguimientoeventos("ConsultarDatosPortes", 0, errordeconexion)

                }

            })
        }



        function consultarAhorrosAlaVista(headers) {
            var optionsAlavista = {
                url: config.url + 'api/risksystems/Soari/Vista',
                method: 'POST',
                JSON: true,
                headers: headers,
                rejectUnauthorized: false,
                body: JSON.stringify({ saldosMayores: 0 })
            }

 
            //Step 3 - do the request
            request(optionsAlavista, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var enviosAlavista = []
                    var dataoptionssAlavista = JSON.parse(body);
                    enviosAlavista.json = JSON.stringify(dataoptionssAlavista)
                    dataoptionssAlavista = dataoptionssAlavista.object
                    var cuantosAlaVista = dataoptionssAlavista.length
                    isertarseguimientoeventos("ConsultarDatosAhorrosalavista", cuantosAlaVista, response.statusCode)



                    if (dataoptionssAlavista.length > 0) {
                        model.SP(enviosAlavista, 'S_sp_datosAhorrosAlavista')
                            .then(function (recordsets) {
                                console.log(recordsets)
                            })
                            .catch(function (err) {
                                console.dir(err);
                                var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                sql.log("Error", message);
                            });


                    } else {
                        console.log(dataoptionssAlavista.length)

                    }

                }
                else {

                    var errordeconexion = ""
                    if (error != null) {
                        errordeconexion = error.message
                    } else {
                        errordeconexion = response.statusCode + ' ' + response.statusMessage
                    }

                    isertarseguimientoeventos("ConsultarDatosAhorrosalavista", 0, errordeconexion)
                }

            })
        }

        function consultarAhorrosContractual(headers) {
            var optionsContractual = {
                url: config.url + 'api/risksystems/Soari/Contractual',
                method: 'POST',
                JSON: true,
                headers: headers,
                rejectUnauthorized: false,
                body: JSON.stringify({ saldosMayores: 0 })
            }


            //Step 3 - do the request
            request(optionsContractual, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var envioscontractual = []
                    var dataoptionssContractual = JSON.parse(body);
                    envioscontractual.json = JSON.stringify(dataoptionssContractual)
                    envioscontractual.TIPOAHORRO = 4
                    dataoptionssContractual = dataoptionssContractual.object
                    var cuantosContractual = dataoptionssContractual.length
                    isertarseguimientoeventos("ConsultarDatosAhorroscontratuales", cuantosContractual, response.statusCode)



                    if (dataoptionssContractual.length > 0) {
                        model.SP(envioscontractual, 'S_sp_datosAhorrosContractualyaTermino')
                            .then(function (recordsets) {
                                console.log(recordsets)
                            })
                            .catch(function (err) {
                                console.dir(err);
                                var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                sql.log("Error", message);
                            });


                    } else {
                        console.log(dataoptionssContractual.length)

                    }

                }
                else {

                    var errordeconexion = ""
                    if (error != null) {
                        errordeconexion = error.message
                    } else {
                        errordeconexion = response.statusCode + ' ' + response.statusMessage
                    }

                    isertarseguimientoeventos("ConsultarDatosAhorroscontratuales", 0, errordeconexion)
                }
            })
        }


        function ConsultarDatosTermino(headers) {
            var optionstermino = {
                url: config.url + 'api/risksystems/Soari/Termino',
                method: 'POST',
                JSON: true,
                headers: headers,
                rejectUnauthorized: false,
                body: JSON.stringify({ saldosMayores: 0 })
            }

            //Step 3 - do the request
            request(optionstermino, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    var enviosTermino = []


                    var dataoptionssTermino = JSON.parse(body);
                    enviosTermino.json = JSON.stringify(dataoptionssTermino)
                    enviosTermino.TIPOAHORRO = 3
                    dataoptionssTermino = dataoptionssTermino.object
                    var cuantosTermino = dataoptionssTermino.length
                    isertarseguimientoeventos("ConsultarDatosTermino", cuantosTermino, response.statusCode)





// var empieza = 0

// while (  empieza >= 0 && empieza <  cuantosTermino)

// {
// if (dataoptionssTermino[empieza].identificacion =='891200043')

//     {

// var prueba= 0

//     }
//     empieza ++;

// }




                    




                    if (dataoptionssTermino.length > 0) {
                        model.SP(enviosTermino, 'S_sp_datosAhorrosContractualyaTermino')
                            .then(function (recordsets) {
                                console.log(recordsets)
                            })
                            .catch(function (err) {
                                console.dir(err);
                                var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                sql.log("Error", message);
                            });
                    }
                    else {
                        console.log(dataoptionssTermino.length)

                    }

                }
                else {

                    var errordeconexion = ""
                    if (error != null) {
                        errordeconexion = error.message
                    } else {
                        errordeconexion = response.statusCode + ' ' + response.statusMessage
                    }
                    isertarseguimientoeventos("ConsultarDatosTermino", 0, errordeconexion)
                }
            })
        }



        function ConsultarDatosPermanente(headers) {
            var optionsPermanente = {
                url: config.url + 'api/risksystems/Soari/Permanente',
                method: 'POST',
                JSON: true,
                headers: headers,
                rejectUnauthorized: false,
                body: JSON.stringify({ saldosMayores: 0 })
            }

            //Step 3 - do the request
            request(optionsPermanente, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    var enviosPermanente = []
                    var dataoptionsPermanente = JSON.parse(body);
                    enviosPermanente.json = JSON.stringify(dataoptionsPermanente)
                    enviosPermanente.TIPOAHORRO = 5
                    dataoptionsPermanente = dataoptionsPermanente.object
                    var cuantosPermanente = dataoptionsPermanente.length
                    isertarseguimientoeventos("ConsultarDatospermanente", cuantosPermanente, response.statusCode)



                    if (dataoptionsPermanente.length > 0) {
                        model.SP(enviosPermanente, 'S_sp_datosAhorrosContractualyaTermino')
                            .then(function (recordsets) {
                                console.log(recordsets)
                            })
                            .catch(function (err) {
                                console.dir(err);
                                var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                sql.log("Error", message);
                            });
                    } else {

                        console.log(dataoptionsPermanente.length)

                    }

                }
                else {

                    var errordeconexion = ""
                    if (error != null) {
                        errordeconexion = error.message
                    } else {
                        errordeconexion = response.statusCode + ' ' + response.statusMessage
                    }
                    isertarseguimientoeventos("ConsultarDatosPermanente", 0, errordeconexion)
                }
            })
        }




        function ConsultarDatoscreditos(headers) {
            var optionsCreditos = {
                url: config.url + 'api/risksystems/Soari/Creditos',
                method: 'POST',
                JSON: true,
                headers: headers,
                rejectUnauthorized: false,
                body: JSON.stringify({ saldosMayores: 0 })
            }

            //Step 3 - do the request
            request(optionsCreditos, function (error, response, body) {
                if (!error && response.statusCode == 200) {


                    var enviosCreditos = []
                    var dataoptionssCreditos = JSON.parse(body);
                    enviosCreditos.json = JSON.stringify(dataoptionssCreditos)

                    dataoptionssCreditos = dataoptionssCreditos.object

                    var cuantosCreditos = dataoptionssCreditos.length
                    isertarseguimientoeventos("ConsultarDatoscreditos", cuantosCreditos, response.statusCode)





                    // var empieza = 0

                    // while (  empieza >= 0 && empieza <  cuantosCreditos)
                    
                    // {
                    // if (dataoptionssCreditos[empieza].cedulaAsociado =='71851065')
                    
                    //     {
                    
                    // var prueba= 0
                    
                    //     }
                    //     empieza ++;
                    
                    // }
                    
                    







                    if (dataoptionssCreditos.length > 0) {
                        model.SP(enviosCreditos, 'S_sp_datosCreditos')
                            .then(function (recordsets) {

                                console.log(recordsets)


                            })
                            .catch(function (err) {

                                console.dir(err);
                                var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                sql.log("Error", message);
                            });
                    } else {

                        console.log(dataoptionssCreditos.length)
                    }



                } else {

                    var errordeconexion = ""
                    if (error != null) {
                        errordeconexion = error.message
                    } else {
                        errordeconexion = response.statusCode + ' ' + response.statusMessage
                    }
                    isertarseguimientoeventos("ConsultarDatoscreditos", 0, errordeconexion)
                }

            })
        }
        function ConsultarDatosNovedades(headers) {
            var optionsnovedades = {
                url: config.url + 'api/risksystems/Soari/Novedades',
                method: 'POST',
                JSON: true,
                headers: headers,
                rejectUnauthorized: false,
                body: JSON.stringify({ saldosMayores: 0 })
            }
            //Step 3 - do the request
            request(optionsnovedades, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var enviosNovedades = []
                    var dataoptionssNovedades = JSON.parse(body);
                    enviosNovedades.json = JSON.stringify(dataoptionssNovedades)

                    dataoptionssNovedades = dataoptionssNovedades.object

                    var cuantosNovedades = dataoptionssNovedades.length
                    isertarseguimientoeventos("ConsultarDatosNovedades", cuantosNovedades, response.statusCode)

                    if (dataoptionssNovedades.length > 0) {
                        model.SP(enviosNovedades, 'S_sp_datosNovedades')
                            .then(function (recordsets) {
                                console.log(recordsets)
                            })
                            .catch(function (err) {
                                console.dir(err);
                                var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                sql.log("Error", message);
                            });
                    } else {
                        console.log(dataoptionssNovedades.length)

                    }

                } else {

                    var errordeconexion = ""
                    if (error != null) {
                        errordeconexion = error.message
                    } else {
                        errordeconexion = response.statusCode + ' ' + response.statusMessage
                    }
                    isertarseguimientoeventos("ConsultarDatosNovedades", 0, errordeconexion)
                }

            })
        }

        function ConsultarTransacciones(headers, entidad) {
            var cadena = "select  year (dtmFechaTrabajo) ano,MONTH(dtmFechaTrabajo) mes,(dtmFechaTrabajo) as dtmFechaTrabajo , dateadd(day,1,dtmFechaTrabajo) as fechatermina, CONVERT(char,GETDATE(),112) as fechasistema,convert(char,dtmFechaTrabajo,112) as fechacompara  from tblVariablesGenerales"
            model.consulta("", cadena)
                .then(function (datafaecha) {



                    var optionsTransacciones = {
                        url: config.url + 'api/risksystems/Soari/Transacciones',
                        method: 'POST',
                        JSON: true,
                        headers: headers,
                        rejectUnauthorized: false,
                        body: JSON.stringify({
                            movimientosDesde: datafaecha[0].dtmFechaTrabajo,
                            movimientosHasta: datafaecha[0].fechatermina
                            // movimientosDesde: "2021-0-01T12:01:50.036Z",
                            // movimientosHasta: "2021-08-31T23:59:50.036Z"


                        })
                    }

                    //Step 3 - do the request
                    request(optionsTransacciones, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var enviosTrasacciones = []
                            var dataoptionsstransacciones = JSON.parse(body);
                            enviosTrasacciones.json = JSON.stringify(dataoptionsstransacciones)

                            dataoptionsstransacciones = dataoptionsstransacciones.object

                            var cuantosTrasacciones = dataoptionsstransacciones.length
                            isertarseguimientoeventos("ConsultarDatosTrasacciones", cuantosTrasacciones, response.statusCode)


// var empieza = 0

// while (  empieza >= 0 && empieza <  cuantosTrasacciones)

// {
// if (dataoptionsstransacciones[empieza].identificacionTitular =='16626538')

//     {

// var prueba= 0

//     }
//     empieza ++;

// }






                            if (dataoptionsstransacciones.length == 0) {



                                if (datafaecha[0].fechacompara != datafaecha[0].fechasistema) {

                                    var cadena = "update tblVariablesGenerales set dtmFechaTrabajo = (select DATEADD(day,1,dtmFechaTrabajo) from tblVariablesGenerales)"
                                    model.consulta("", cadena)
                                        .then(function (recordsets) {
                                            console.log(recordsets);

                                        })

                                }

                                notificaciontransaccionesxdia("ConsultarDatosTrasacciones")
                                //   Alertassegmentacion(entidad,datafaecha[0].ano,datafaecha[0].mes)
                                return

                            }

                            var cadena = "delete from tbltransaccionesgenerales  where convert(char,dtmFechaHora,112) = (select dtmFechaTrabajo from tblVariablesGenerales)"
                            var contador = 0
                            model.consulta("", cadena)
                                .then(function (recordsets) {
                                    console.log(recordsets);
                                })
                                .catch(function (err) {
                                    console.dir(err);
                                    var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                    sql.log("Error", message);
                                });


                         
                      
                            var cadena = "delete from tblTransacciones  where convert(char,dtmFechaHora,112) = (select dtmFechaTrabajo from tblVariablesGenerales)"
                            var contador = 0
                            model.consulta("", cadena)
                                .then(function (recordsets) {
                                    console.log(recordsets);

                                    model.SP(enviosTrasacciones, 'S_sp_datosTransacciones')
                                        .then(function (recordsets) {
                                            console.log(recordsets);



                                            notificaciontransaccionesxdia("ConsultarDatosTrasacciones")


                                            ///// se debe comentar generaraalertas cuando este la segmentacion por quer se ejecuta adentro de la segmentacion 

                                            // if (config.binding != "FEC") {
                                            //     generaraalertas(datafaecha[0].ano, datafaecha[0].mes)
                                            // }

                                            // else {
                                                Alertassegmentacionynormales (entidad, datafaecha[0].ano, datafaecha[0].mes)
                                            // }
                                          //       Balance(headers, datafaecha[0].ano, datafaecha[0].mes)



                                        })
                                        .catch(function (err) {
                                            console.dir(err);
                                            var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                            sql.log("Error", message);
                                        });


                                })
                                .catch(function (err) {
                                    console.dir(err);
                                    var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                    sql.log("Error", message);
                                });

                        } else {

                            var errordeconexion = ""
                            if (error != null) {
                                errordeconexion = error.message
                            } else {
                                errordeconexion = response.statusCode + ' ' + response.statusMessage
                            }
                            isertarseguimientoeventos("ConsultarDatosTrasacciones", 0, errordeconexion)
                            notificaciontransaccionesxdia("ConsultarDatosTrasacciones")
                        }

                    })
                })
                .catch(function (err) {
                    console.dir(err);
                    var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                    sql.log("Error", message);
                });

        }

        function Balance(headers, ano, mes) {
            var cadena = "select intid,numerocuenta from tblcuentasbalance"
            model.consulta("", cadena)
                .then(function (data) {

                    var inicio = (data.length == 0 ? 1 : 0)
                    var fin = data.length

                    while (inicio >= 0 && inicio < fin) {
                        var optionsbalance = {
                            url: config.url + 'api/risksystems/Soari/Balance',
                            method: 'POST',
                            JSON: true,
                            headers: headers,
                            rejectUnauthorized: false,
                            body: JSON.stringify({
                                codigoCuentas: [
                                    data[inicio].numerocuenta
                                ],
                                saldosMayores: 0,
                                anio: ano,
                                mes: mes
                            }

                            )
                        }

                        //Step 3 - do the request
                        request(optionsbalance, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var databalance = JSON.parse(body);
                                databalance = databalance.object
                                if (databalance.length != 0) {

                                    var parametro = {
                                        codigoCuenta: databalance[0].codigoCuenta,
                                        fechaCorte: databalance[0].fechaCorte,
                                        nombreCuenta: databalance[0].nombreCuenta.trim(),
                                        saldoCuenta: databalance[0].saldoCuenta.toString(),
                                        ano: ano,
                                        mes: mes


                                    }

                                    model.SP(parametro, 'REGISTRARBALANCEMENSUAL')
                                        .then(function (data1) {

                                            console.log(data1);

                                        })
                                        .catch(function (err) {
                                            console.dir(err);
                                            var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                            sql.log("Error", message);
                                        });

                                }

                                // else {

                                //     isertarseguimientoeventos("ConsultarDatosBalanace", 0, "no trajo datos")

                                // }

                            } else {
                                var errordeconexion = ""
                                if (error != null) {
                                    errordeconexion = error.message
                                } else {
                                    errordeconexion = response.statusCode + ' ' + response.statusMessage
                                }
                                //  isertarseguimientoeventos("ConsultarDatosBalanace", 0, errordeconexion)

                            }



                        })
                        inicio++

                    }
                })
                .catch(function (err) {
                    console.dir(err);
                    var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                    sql.log("Error", message);
                })

        }

        function generaraalertas(ano, mes) {
            var cadena = "delete from tblAlertasGeneradas  where convert(char,dtmFecha,112) = (select dtmFechaTrabajo from tblVariablesGenerales)"
            model.consulta("", cadena)
                .then(function (recordsets) {
                    console.log(recordsets);

                    // www.soari.co:80 http://localhost:64871
                    var optionsContractual = {
                        url: 'https://localhost/FuenteDatosOpa/ProcesarAlertasservicio?Ano=' + ano + '&Mes=' + mes + '&NitEntidad=' + entidad + '&Entidad=' + config.ClaveEntidad,
                        method: 'POST',
                        jar: true,
                        headers: headers,
                        rejectUnauthorized: false
                    }

                    //Step 3 - do the request
                    request(optionsContractual, function (error, response, body) {

                        var errordeconexion = ""
                        if (error != null) {
                            errordeconexion = error.message
                        } else {
                            errordeconexion = response.statusCode + ' ' + response.statusMessage
                        }
                        isertarseguimientoeventos("ProcesarAlertasservicio", 0, errordeconexion)

                        // var cadena = "update tblVariablesGenerales set dtmFechaTrabajo = (select DATEADD(day,1,dtmFechaTrabajo) from tblVariablesGenerales)"
                        // model
                        //     .consulta("", cadena)
                        //     .then(function (recordsets) {
                        //         console.log(recordsets);

                        //     })
                        // }

                    })
                })
        }

        function isertarseguimientoeventos(Metodo, Cantidaddatos, Eventos) {
            var cadena = "insert into tbllogservicio(Metodo,Cantidaddatos,Fechaproceso,Fechatrabajo,Eventos) " +
                "select '" + Metodo + "'," + Cantidaddatos + ",getdate(),(select top 1 dtmFechaTrabajo  from tblVariablesGenerales),'" + Eventos + "'";
            model.consulta("", cadena)
                .then(function (recordsets) {

                })
                .catch(function (err) {
                    console.dir(err);
                });
        }



        Notificafechaproximagestion()




        function Notificafechaproximagestion() {


            var optionsContractual = {
                url: 'https://localhost/Alertas/Notificafechaproximagestion?NitEntidad=' + entidad,
                method: 'POST',
                jar: true,
                headers: headers
            }

            //Step 3 - do the request
            request(optionsContractual, function (error, response, body) {

                var errordeconexion = ""
                if (error != null) {
                    errordeconexion = error.message
                } else {
                    errordeconexion = response.statusCode + ' ' + response.statusMessage
                }
                isertarseguimientoeventos("Notificafechaproximagestion", 0, errordeconexion)


            })

        }



        function notificacionfrecuenciamonitoreo() {
            var optionsnotificacion = {
                url: 'https://localhost/Monitoreos/NotificaMonitoreo?NitEntidad=' + entidad,
                method: 'POST',
                jar: true,
                headers: headers,
                rejectUnauthorized: false
            }


            request(optionsnotificacion, function (error, response, body) {
                if (!error && response.statusCode == 200) {


                }
            })

        }


        function notificaciontransaccionesxdia(metodo) {
            var optionsnotificacion = {
                url: 'https://localhost/Alertas/Notificametodosdelservicioejecuta?NitEntidad=' + entidad + "&&nombreenti=" + config.binding + "&&metodo=" + metodo,
                method: 'POST',
                jar: true,
                headers: headers,
                rejectUnauthorized: false
            }


            request(optionsnotificacion, function (error, response, body) {
                if (!error && response.statusCode == 200) {


                }
            })

        }


        function enviarwhatsapp(message, number) {
            var headers = {
                'User-Agent': 'Super Agent/0.0.1',
                'Content-Type': 'application/json'
            }

            var request = require('request');
            var options = {
                url: 'http://localhost:3021/send?message=' + message + '&to=' + number,
                method: 'POST',
                JSON: true,
                headers: headers,
                rejectUnauthorized: false,
            }

            request(options, function (error, response, body) {
                var prueba = body;
            });



        }



        async function Alertassegmentacionynormales(entidad, ano, mes) {



            model.SP("", "generaralertassegmentacion")
                .then(function (data) {
                    console.log(data)

                    generaraalertas(ano, mes)

                }).catch(function (err) {
                    console.dir(err);
                    var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                    sql.log("Error", message);
                });


            // var sql = require("../model/mssql.js")


            // var configuracion = require("../routes/entidadesconfiguracion.js")

            // var config = configuracion.entidadesconfiguracion(entidad)

            // // await sql.connect(config).then(function (model) {

            //     const fs =
            //     require('fs')
            // const path1 = 'C:\\inetpub\\wwwroot\\Soari\\Downloads\\' + entidad
            // if (fs.existsSync(path1)) {
            //     var files = ' '
            //     files = fs.readdirSync(path1)
            // }
            // else 
            // {

            //     generaraalertas(ano,mes)
            //     return
            // }




            //     var cadena =  "select * from  tbllogArchivocargado  where trNombrearchivo = '" + files[0] + "'" 
            //     model.consulta("", cadena)
            //         .then(function (data) {


            //             if (files.length > 0 && data.length == 0) {
            //                 var Excel = require('exceljs');

            //                 var wb = new Excel.Workbook();
            //                 var path = require('path');
            //                 var nombrearchivo = files[0];
            //                 var filePath = path.resolve('C:\\inetpub\\wwwroot\\Soari\\Downloads\\' + entidad, nombrearchivo);

            //                 wb.xlsx.readFile(filePath).then(function () {

            //                     var sh = wb.getWorksheet("ASOCIADOS");


            //                     sh.getColumn()
            //                     // wb.xlsx.writeFile('new.xlsx');
            //                     // wb.xlsx.writeFile(nombrearchivo);
            //                     var json = []
            //                     var jsonarray = []
            //                     //Get all the rows data [1st and 2nd column]
            //                     for (i = 3; i <= sh.rowCount; i++) {
            //                         var datainsercion = {}
            //                         datainsercion.numNit = sh.getRow(i).getCell(1).value;
            //                         datainsercion.segmento = sh.getRow(i).getCell(17).value.result;
            //                         datainsercion.Val_transaccioningresos = sh.getRow(i).getCell(8).value == undefined ? 0 : sh.getRow(i).getCell(8).value;
            //                         datainsercion.Cant_transaccioningresos = sh.getRow(i).getCell(9).value == undefined ? 0 : sh.getRow(i).getCell(9).value;
            //                         datainsercion.Val_transaccionEgresos = sh.getRow(i).getCell(10).value == undefined ? 0 : sh.getRow(i).getCell(10).value;
            //                         datainsercion.Cant_transaccionEgresos = sh.getRow(i).getCell(11).value == undefined ? 0 : sh.getRow(i).getCell(11).value;


            //                         datainsercion.Val_IRB = sh.getRow(22).getCell(28).value.result == undefined ? 0 : sh.getRow(22).getCell(28).value.result;
            //                         datainsercion.Val_IRM = sh.getRow(23).getCell(28).value.result == undefined ? 0 : sh.getRow(23).getCell(28).value.result;
            //                         datainsercion.Val_IRA = sh.getRow(24).getCell(28).value.result == undefined ? 0 : sh.getRow(24).getCell(28).value.result;
            //                         datainsercion.Val_IRE = sh.getRow(25).getCell(28).value.result == undefined ? 0 : sh.getRow(25).getCell(28).value.result;
            //                         datainsercion.Val_ERB = sh.getRow(30).getCell(28).value.result == undefined ? 0 : sh.getRow(30).getCell(28).value.result;
            //                         datainsercion.Val_ERM = sh.getRow(31).getCell(28).value.result == undefined ? 0 : sh.getRow(31).getCell(28).value.result;
            //                         datainsercion.Val_ERA = sh.getRow(32).getCell(28).value.result == undefined ? 0 : sh.getRow(32).getCell(28).value.result;
            //                         datainsercion.Val_ERE = sh.getRow(33).getCell(28).value.result == undefined ? 0 : sh.getRow(33).getCell(28).value.result;

            //                         jsonarray.push(datainsercion)


            //                     };

            //                     json.json = JSON.stringify(jsonarray)
            //                     json.queinserta = 'A'

            //                     // var cadenaINSERT = "insert into tblsegmentacionAsociado(numnit,Val_transaccioningresos,Cant_transaccioningresos,Val_transaccionEgresos," +
            //                     // "Cant_transaccionEgresos,segmento,Val_IRB,Val_IRM,Val_IRA,Val_IRE,Val_ERB,Val_ERM,Val_ERA,Val_ERE) values ('" + datainsercion.numNit  + "'," +
            //                     // datainsercion.Val_transaccioningresos  + "," + datainsercion.Cant_transaccioningresos  + ","  + datainsercion.Val_transaccionEgresos  + "," + 
            //                     // datainsercion.Cant_transaccionEgresos + ",'" + datainsercion.segmento + "'," + datainsercion.Val_IRB + "," + datainsercion.Val_IRM + "," + 
            //                     // datainsercion.Val_IRA + "," + datainsercion.Val_IRE + "," + datainsercion.Val_ERB + "," + datainsercion.Val_ERM + "," + datainsercion.Val_ERA + "," +
            //                     // datainsercion.Val_ERE + ")" 


            //                     model.SP(json, "Insertararchivsegmentacion")
            //                         .then(function (data) {
            //                             console.log(data)

            //                         }).catch(function (err) {
            //                             console.dir(err);
            //                             var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
            //                             sql.log("Error", message);
            //                         });


            //                     //  --------------------------------------PRODUCTO




            //                      var sp = wb.getWorksheet("PRODUCTOS");

            //                     sp.getColumn()
            //                     // wb.xlsx.writeFile('new.xlsx');
            //                     // wb.xlsx.writeFile(nombrearchivo);
            //                     var jsonproducto = []
            //                     var jsonarrayproducto = []
            //                     //Get all the rows data [1st and 2nd column]
            //                     for (i = 4; i <= sp.rowCount; i++) {
            //                         var datainsercionProdcuto = {}
            //                         datainsercionProdcuto.numNit = sp.getRow(i).getCell(1).value;
            //                         datainsercionProdcuto.Val_transaccioningresosVIS = sp.getRow(i).getCell(2).value == undefined ? 0 : sp.getRow(i).getCell(2).value;
            //                         datainsercionProdcuto.Cant_transaccioningresosVIS = sp.getRow(i).getCell(3).value == undefined ? 0 : sp.getRow(i).getCell(3).value;
            //                         datainsercionProdcuto.Val_transaccionEgresosVIS = sp.getRow(i).getCell(4).value == undefined ? 0 : sp.getRow(i).getCell(4).value;
            //                         datainsercionProdcuto.Cant_transaccionEgresosVIS = sp.getRow(i).getCell(5).value == undefined ? 0 : sp.getRow(i).getCell(5).value;

            //                         datainsercionProdcuto.Val_transaccioningresosPerma = sp.getRow(i).getCell(6).value == undefined ? 0 : sp.getRow(i).getCell(6).value;
            //                         datainsercionProdcuto.Cant_transaccioningresosPerma = sp.getRow(i).getCell(7).value == undefined ? 0 : sp.getRow(i).getCell(7).value;
            //                         datainsercionProdcuto.Val_transaccionEgresosPerma = sp.getRow(i).getCell(8).value == undefined ? 0 : sp.getRow(i).getCell(8).value;
            //                         datainsercionProdcuto.Cant_transaccionEgresosPerma = sp.getRow(i).getCell(9).value == undefined ? 0 : sp.getRow(i).getCell(9).value;

            //                         datainsercionProdcuto.Val_transaccioningresosContra = sp.getRow(i).getCell(10).value == undefined ? 0 : sp.getRow(i).getCell(10).value;
            //                         datainsercionProdcuto.Cant_transaccioningresosContra = sp.getRow(i).getCell(11).value == undefined ? 0 : sp.getRow(i).getCell(11).value;
            //                         datainsercionProdcuto.Val_transaccionEgresosContra = sp.getRow(i).getCell(12).value == undefined ? 0 : sp.getRow(i).getCell(12).value;
            //                         datainsercionProdcuto.Cant_transaccionEgresosContra = sp.getRow(i).getCell(13).value == undefined ? 0 : sp.getRow(i).getCell(13).value;

            //                         datainsercionProdcuto.Val_transaccioningresosaterm = sp.getRow(i).getCell(14).value == undefined ? 0 : sp.getRow(i).getCell(10).value;
            //                         datainsercionProdcuto.Cant_transaccioningresosaterm = sp.getRow(i).getCell(15).value == undefined ? 0 : sp.getRow(i).getCell(11).value;
            //                         datainsercionProdcuto.Val_transaccionEgresosaterm = sp.getRow(i).getCell(16).value == undefined ? 0 : sp.getRow(i).getCell(12).value;
            //                         datainsercionProdcuto.Cant_transaccionEgresosaterm = sp.getRow(i).getCell(17).value == undefined ? 0 : sp.getRow(i).getCell(13).value;


            //                         datainsercionProdcuto.Val_transaccioningresoscons = sp.getRow(i).getCell(31).value == undefined ? 0 : sp.getRow(i).getCell(10).value;
            //                         datainsercionProdcuto.Cant_transaccioningresoscons = sp.getRow(i).getCell(32).value == undefined ? 0 : sp.getRow(i).getCell(11).value;
            //                         datainsercionProdcuto.Val_transaccionEgresosacons = sp.getRow(i).getCell(33).value == undefined ? 0 : sp.getRow(i).getCell(12).value;
            //                         datainsercionProdcuto.Cant_transaccionEgresosacons = sp.getRow(i).getCell(34).value == undefined ? 0 : sp.getRow(i).getCell(13).value;

            //                         datainsercionProdcuto.Val_transaccioningresoscome = sp.getRow(i).getCell(35).value == undefined ? 0 : sp.getRow(i).getCell(35).value;
            //                         datainsercionProdcuto.Cant_transaccioningresoscome = sp.getRow(i).getCell(36).value == undefined ? 0 : sp.getRow(i).getCell(36).value;
            //                         datainsercionProdcuto.Val_transaccionEgresosacome = sp.getRow(i).getCell(37).value == undefined ? 0 : sp.getRow(i).getCell(37).value;
            //                         datainsercionProdcuto.Cant_transaccionEgresosacome = sp.getRow(i).getCell(38).value == undefined ? 0 : sp.getRow(i).getCell(38).value;
            //                         datainsercionProdcuto.segmento = sp.getRow(i).getCell(55).value.result;


            //                         // -------------------------a la vista 
            //                         datainsercionProdcuto.Val_IARB = sp.getRow(22).getCell(65).value.result == undefined ? 0 : sp.getRow(22).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_IARM = sp.getRow(23).getCell(65).value.result == undefined ? 0 : sp.getRow(23).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_IARA = sp.getRow(24).getCell(65).value.result == undefined ? 0 : sp.getRow(24).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_IARE = sp.getRow(25).getCell(65).value.result == undefined ? 0 : sp.getRow(25).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_EARB = sp.getRow(30).getCell(65).value.result == undefined ? 0 : sp.getRow(30).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_EARM = sp.getRow(31).getCell(65).value.result == undefined ? 0 : sp.getRow(31).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_EARA = sp.getRow(32).getCell(65).value.result == undefined ? 0 : sp.getRow(32).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_EARE = sp.getRow(33).getCell(65).value.result == undefined ? 0 : sp.getRow(33).getCell(65).value.result;


            //                         // -------------------------Permanente
            //                         datainsercionProdcuto.Val_IPRB = sp.getRow(39).getCell(65).value.result == undefined ? 0 : sp.getRow(39).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_IPRM = sp.getRow(40).getCell(65).value.result == undefined ? 0 : sp.getRow(40).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_IPRA = sp.getRow(41).getCell(65).value.result == undefined ? 0 : sp.getRow(41).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_IPRE = sp.getRow(42).getCell(65).value.result == undefined ? 0 : sp.getRow(42).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_EPRB = sp.getRow(47).getCell(65).value.result == undefined ? 0 : sp.getRow(47).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_EPRM = sp.getRow(48).getCell(65).value.result == undefined ? 0 : sp.getRow(48).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_EPRA = sp.getRow(49).getCell(65).value.result == undefined ? 0 : sp.getRow(49).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_EPRE = sp.getRow(50).getCell(65).value.result == undefined ? 0 : sp.getRow(50).getCell(65).value.result;


            //                         // -------------------------Contractual
            //                         datainsercionProdcuto.Val_ICRB = sp.getRow(55).getCell(65).value.result == undefined ? 0 : sp.getRow(55).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_ICRM = sp.getRow(56).getCell(65).value.result == undefined ? 0 : sp.getRow(56).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_ICRA = sp.getRow(57).getCell(65).value.result == undefined ? 0 : sp.getRow(57).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_ICRE = sp.getRow(58).getCell(65).value.result == undefined ? 0 : sp.getRow(58).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_ECRB = sp.getRow(63).getCell(65).value.result == undefined ? 0 : sp.getRow(63).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_ECRM = sp.getRow(64).getCell(65).value.result == undefined ? 0 : sp.getRow(64).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_ECRA = sp.getRow(65).getCell(65).value.result == undefined ? 0 : sp.getRow(65).getCell(65).value.result;
            //                         datainsercionProdcuto.Val_ECRE = sp.getRow(66).getCell(65).value.result == undefined ? 0 : sp.getRow(66).getCell(65).value.result;

            //   // -------------------------a termino 
            //   datainsercionProdcuto.Val_ITRB = sp.getRow(71).getCell(65).value.result == undefined ? 0 : sp.getRow(71).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ITRM = sp.getRow(72).getCell(65).value.result == undefined ? 0 : sp.getRow(72).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ITRA = sp.getRow(73).getCell(65).value.result == undefined ? 0 : sp.getRow(73).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ITRE = sp.getRow(74).getCell(65).value.result == undefined ? 0 : sp.getRow(74).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ETRB = sp.getRow(79).getCell(65).value.result == undefined ? 0 : sp.getRow(79).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ETRM = sp.getRow(80).getCell(65).value.result == undefined ? 0 : sp.getRow(80).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ETRA = sp.getRow(81).getCell(65).value.result == undefined ? 0 : sp.getRow(81).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ETRE = sp.getRow(82).getCell(65).value.result == undefined ? 0 : sp.getRow(82).getCell(65).value.result;


            //   // -------------------------a consumo 
            //   datainsercionProdcuto.Val_ICORB = sp.getRow(87).getCell(65).value.result == undefined ? 0 : sp.getRow(87).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ICORM = sp.getRow(88).getCell(65).value.result == undefined ? 0 : sp.getRow(88).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ICORA = sp.getRow(89).getCell(65).value.result == undefined ? 0 : sp.getRow(89).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ICORE = sp.getRow(90).getCell(65).value.result == undefined ? 0 : sp.getRow(90).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ECORB = sp.getRow(95).getCell(65).value.result == undefined ? 0 : sp.getRow(95).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ECORM = sp.getRow(96).getCell(65).value.result == undefined ? 0 : sp.getRow(96).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ECORA = sp.getRow(97).getCell(65).value.result == undefined ? 0 : sp.getRow(97).getCell(65).value.result;
            //   datainsercionProdcuto.Val_ECORE = sp.getRow(98).getCell(65).value.result == undefined ? 0 : sp.getRow(98).getCell(65).value.result;


            //  // -------------------------a comercial 
            //  datainsercionProdcuto.Val_IMERB = sp.getRow(103).getCell(65).value.result == undefined ? 0 : sp.getRow(103).getCell(65).value.result;
            //  datainsercionProdcuto.Val_IMERM = sp.getRow(104).getCell(65).value.result == undefined ? 0 : sp.getRow(104).getCell(65).value.result;
            //  datainsercionProdcuto.Val_IMERA = sp.getRow(105).getCell(65).value.result == undefined ? 0 : sp.getRow(105).getCell(65).value.result;
            //  datainsercionProdcuto.Val_IMERE = sp.getRow(106).getCell(65).value.result == undefined ? 0 : sp.getRow(106).getCell(65).value.result;
            //  datainsercionProdcuto.Val_EMERB = sp.getRow(111).getCell(65).value.result == undefined ? 0 : sp.getRow(111).getCell(65).value.result;
            //  datainsercionProdcuto.Val_EMERM = sp.getRow(112).getCell(65).value.result == undefined ? 0 : sp.getRow(112).getCell(65).value.result;
            //  datainsercionProdcuto.Val_EMERA = sp.getRow(113).getCell(65).value.result == undefined ? 0 : sp.getRow(113).getCell(65).value.result;
            //  datainsercionProdcuto.Val_EMERE = sp.getRow(114).getCell(65).value.result == undefined ? 0 : sp.getRow(114).getCell(65).value.result;

            //  jsonarrayproducto.push(datainsercionProdcuto)

            //                     };

            //            jsonproducto.json = JSON.stringify(jsonarrayproducto)
            //            jsonproducto.queinserta = 'P'

            //                     model.SP(jsonproducto, "Insertararchivsegmentacion")
            //                         .then(function (data) {
            //                             console.log(data)

            //                         }).catch(function (err) {
            //                             console.dir(err);
            //                             var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
            //                             sql.log("Error", message);
            //                         });

            //         // ---------------------------------------canales----------------------------


            //                 cadena = "select  DISTINCT(idcanal) id, (SELECT  COUNT(*) FROM Information_Schema.Columns " +
            //                 " WHERE Table_Name = 'tblsegmentacioncanales' GROUP BY Table_Name) as cantidadcolumnas,(select COUNT(*) from tblsegmentacioncanales) as cantidad " +
            //                 " from tblFuentesSegmentacion f inner join tblCanales c on c.intId = f.idcanal "


            //                 model.consulta("", cadena)
            //                 .then(function (datacanales) {

            //      var sp = wb.getWorksheet("CANALES");
            //      sp.getColumn()
            //         var jsoncanal = []
            //         var jsonarraycanal = []
            //         var cantidadcolumnas = datacanales[0].cantidadcolumnas + 3;
            //         //Get all the rows data [1st and 2nd column]
            //         var cantidad = datacanales[0].cantidad +2
            //         for (i = 3; i <= sp.rowCount; i++) {
            //             var datainsercioncanal = {}
            //             // var iniciocanal = 0
            //             // var terminacanal = datacanales.length
            //             // var C = 2
            //             // var idcanal = 0
            //             datainsercioncanal.numNit = sp.getRow(i).getCell(1).value;


            //             if (sp.getRow(i).getCell(cantidadcolumnas).value != null  ) 
            //             {
            //                 datainsercioncanal["segmento"] = sp.getRow(i).getCell(cantidadcolumnas).value.result == undefined ? "sin segmento" : sp.getRow(i).getCell(cantidadcolumnas).value.result;
            //                 jsonarraycanal.push(datainsercioncanal)
            //             }

            //     }

            //     jsoncanal.json = JSON.stringify(jsonarraycanal)
            //     jsoncanal.queinserta = 'C'

            //     model.SP(jsoncanal, "Insertararchivsegmentacion")
            //     .then(function (data) {
            //         console.log(data)



            //         var cadena = "insert into tbllogArchivocargado (trNombrearchivo,fechacargue) " +
            //                       "select '" + nombrearchivo + "',getdate()"
            //     model.consulta("", cadena)
            //         .then(function (data) {
            //         }).catch(function (err) {
            //             console.dir(err);
            //             var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
            //             sql.log("Error", message);
            //         });


            //    model.SP("", "generaralertassegmentacion")
            //          .then(function (data) {
            //              console.log(data)                

            //         generaraalertas(ano,mes)

            //     }).catch(function (err) {
            //         console.dir(err);
            //         var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
            //         sql.log("Error", message);
            //     });


            // }).catch(function (err) {
            //     console.dir(err);
            //     var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
            //     sql.log("Error", message);
            // });





            //             }).catch(function (err) {
            //                 console.dir(err);
            //                 var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
            //                 sql.log("Error", message);
            //             });
            //         })
            //         } else 
            //         {


            //         model.SP("", "generaralertassegmentacion")
            //         .then(function (data) {
            //             console.log(data)                

            //         generaraalertas(ano,mes)

            //     }).catch(function (err) {
            //         console.dir(err);
            //         var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
            //         sql.log("Error", message);
            //     });

            // }


            //     }).catch(function (err) {
            //         console.dir(err);
            //         var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
            //         sql.log("Error", message);
            //     });








            // });
        };

        function ConsultarTransaccionesENBLOQUE(headers) {
                   
            var optionsTransacciones = {
                url: config.url + 'api/risksystems/Soari/Transacciones',
                method: 'POST',
                JSON: true,
                headers: headers,
                rejectUnauthorized: false,
                body: JSON.stringify({
                    movimientosDesde: '2021-01-01',
                    movimientosHasta: '2022-05-31'
                })
            }

            //Step 3 - do the request
            request(optionsTransacciones, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var enviosTrasacciones = []  
                    var dataoptionsstransacciones = JSON.parse(body);
                    enviosTrasacciones.json = JSON.stringify(dataoptionsstransacciones)
             
                    dataoptionsstransacciones = dataoptionsstransacciones.object
                 
                    var cuantosTrasacciones = dataoptionsstransacciones.length

                    if (dataoptionsstransacciones.length == 0) {
                        return
                    }

                    var cadena = "delete from tbltransaccionesgenerales  where convert(char,dtmFechaHora,112) >= convert(char,'20210101',112) and convert(char,dtmFechaHora,112) <= convert(char,'20220531',112)"
                    var contador = 0
                    model.consulta("", cadena)
                        .then(function (recordsets) {
                            console.log(recordsets);
                            
                        })
                        .catch(function (err) {
                            console.dir(err);
                            var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                            sql.log("Error", message);
                        });
                   
                   
                            model.SP(enviosTrasacciones, 'S_sp_datosTransaccionesenbloque')
                            .then(function (recordsets) {
                                console.log(recordsets);
                                                                                        

                            })
                            .catch(function (err) {
                                console.dir(err);
                                var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                sql.log("Error", message);
                            });
                       
                } else {

                    var errordeconexion = ""
                    if (error != null) {
                        errordeconexion = error.message
                    } else {
                        errordeconexion = response.statusCode + ' ' + response.statusMessage
                    }
         
                }

            })
      
}



    })
}