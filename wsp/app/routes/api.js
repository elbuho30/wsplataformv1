router = require("express").Router(),
sql = require("../model/mssql.js"),
config = require("../../config.json")
const enviarsms = require("./enviarsms")
const enviarEmail = require("./enviarmail")

const fs = require('fs');
moment = require("moment"),

express = require("express");

var app = express();
var bodyParser = require("body-parser");
var Cryptr = require("cryptr");
const enviarmail = require("./enviarmail.js");
const { Int } = require("mssql");
const { env } = require("process");

// sql.connect(config).then(function(model) {
// emailGenerator = emailGenerator(config.emailConfig);



router.get("/", function (request, response) {
    response.send('Simple WhatsApp Webhook tester</br>There is no front-end, see server.js for implementation!');
  });
  
  router.get('/webhook', function(req, res) {
    if (
      req.query['hub.mode'] == 'subscribe' &&
      req.query['hub.verify_token'] == 'whatsapp0132'
    ) {
      res.send(req.query['hub.challenge']);
    } else {
      res.sendStatus(400);
    }
  });


router.post("/prueba", function (req, res) {

    var request = require('request');
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }

    var options = {
        url: 'http://localhost:64871/datosenlinea/Enviarwhatsappnode?datajson=' + JSON.stringify(req.body),
        method: 'POST',
        JSON: true,
        headers: headers,
        rejectUnauthorized: false,
        body: JSON.stringify(req.Body)

    }

    request(options, function (error, response, body) {
        var prueba = body;
    });

    res.json("Prueba")

})


router.post("/webhook", function (req, res) {


    sql.connect(config).then(function (model) {
    var store = require('store')
    var moment = require("moment");

// console.log(req.body)
// console.log(req.query)


    let str = JSON.stringify(req.body).replace(/(")/gm, "")
    str = JSON.stringify(str).replace(/(\\)/gm, "")
    str = JSON.stringify(str).replace(/([{}])/gm, "")


    let arr = str.split(',');

    if (arr[6].substring(7, 20) == "sent" || arr[6].substring(7, 20) == "delivered" || arr[6].substring(7, 20) == "read") {

        return
    }

    if (arr[9].indexOf("from") >= 0) {
        var from = arr[9].substring(5, 30)
    } 
    if (arr[8].indexOf("from") >= 0) {
        var from = arr[8].substring(5, 30)
    } 
    if (arr[9].indexOf("from") < 0 && arr[8].indexOf("from") < 0) {
        var from = arr[7].substring(15, 30)
    } 
    


    if (store.get(from) != undefined) {

        store.set(from, {
            numero: store.get(from).numero,
            paso: store.get(from).paso,
            opcion:store.get(from).opcion,
            hora: store.get(from).hora,
            fecha: store.get(from).fecha,
            data: arr,
            intentosMenu: store.get(from).intentosMenu,
            body: store.get(from).body,
            intentoscedula: store.get(from).intentoscedula,
            token:store.get(from).token,
            nit: store.get(from).nit,
            validacuenta: store.get(from).validacuenta, 
            tokenvalida:store.get(from).tokenvalida,
            cuentas:store.get(from).cuentas,
            cadena: store.get(from).cadena,
            intentos:store.get(from).intentos,
            intentoscuenta: store.get(from).intentoscuenta,
            contador: store.get(from).contador,
            intentosPagare: store.get(from).intentosPagare,
            ultimoregistro:store.get(from).ultimoregistro,
            pagare : store.get(from).pagare,
            cuenta: store.get(from).cuenta,
            intentosoficina: store.get(from).intentosoficina,
            intentosdepartamentos: store.get(from).intentosdepartamentos,
            valor: store.get(from).valor,
            cadenaguardavalores: store.get(from).cadenaguardavalores,
            cadenalineasaguardar: store.get(from).cadenalineasaguardar,
            posicionextencion: store.get(from).posicionextencion,
            extencion: store.get(from).extencion

         
        })


    } else {
        store.set(from, {
            numero: arr[7].substring(28, 15),
            hora: moment(new Date()).format('h:mm:ss a'),
            fecha: moment(new Date()),
            body: arr[10].substring(10, 21),
            Primeravez: 'S',
            data: arr,
       
        })

    }


    var request = require('request');
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json',
        'Authorization': env('META_TOKEN')
    }



if(store.get(from).data.length > 14 &&  store.get(from).data[10].indexOf("image") < 0 )
{
    if (store.get(from).data[15].indexOf("Salir") >= 0  || store.get(from).data[15].indexOf("salir") >= 0 ){

        peticioneswhatasapp(store.get(from).numero, "Fue un placer atenderte, gracias por utilizar nuestros servicios.\nIngresa a nuestra sucursal virtual 🖥️ aquí https://bit.ly/3mgcBQM,\ndescarga la app asociados 📱 para Android aquí https://bit.ly/3pXCshr\npara IOS aquí https://apple.co/3w2JTWS podrás informarte, consultar tus saldos y realizar transacciones, te esperamos de nuevo...😊", "Text")
        store.remove(from)
        return
    }

    if (store.get(from).data[15].indexOf("Ir a departamentos.") >= 0 && store.get(from).numero == from) {

        oficinas()
        return

    }
    if (store.get(from).data[15].indexOf("volver al inicio") >= 0 || store.get(from).data[15].indexOf("Volver al inicio") >= 0 || store.get(from).data[15].indexOf("inicio") >= 0 || store.get(from).data[15].indexOf("Inicio") >= 0 || store.get(from).data[15].indexOf("Iniciar") >= 0  || store.get(from).data[15].indexOf("iniciar") >= 0  || store.get(from).data[15].indexOf("Menú") >= 0  || store.get(from).data[15].indexOf("menú") >= 0  || store.get(from).data[15].indexOf("Menu") >= 0  || store.get(from).data[15].indexOf("menu") >= 0 ) {
        store.set(from, {
            numero: store.get(from).numero,
            hora: moment(new Date()).format('h:mm:ss a'),
            fecha: moment(new Date()),
            Primeravez: 'S'
        })
       
    }

 




} else 
{

    if (store.get(from).data[10].indexOf("Salir") >= 0  || store.get(from).data[10].indexOf("salir") >= 0 ){

        peticioneswhatasapp(store.get(from).numero, "Fue un placer atenderte, gracias por utilizar nuestros servicios.\nIngresa a nuestra sucursal virtual 🖥️ aquí https://bit.ly/3mgcBQM,\ndescarga la app asociados 📱 para Android aquí https://bit.ly/3pXCshr\npara IOS aquí https://apple.co/3w2JTWS podrás informarte, consultar tus saldos y realizar transacciones, te esperamos de nuevo...😊", "Text")
        store.remove(from)
        return
    }

    if (store.get(from).data[10].indexOf("volver al inicio") >= 0 || store.get(from).data[10].indexOf("Volver al inicio") >= 0 || store.get(from).data[10].indexOf("inicio") >= 0 || store.get(from).data[10].indexOf("Inicio") >= 0 || store.get(from).data[10].indexOf("Iniciar") >= 0  || store.get(from).data[10].indexOf("iniciar") >= 0  || store.get(from).data[10].indexOf("Menú") >= 0  || store.get(from).data[10].indexOf("menú") >= 0  || store.get(from).data[10].indexOf("Menu") >= 0  || store.get(from).data[10].indexOf("menu") >= 0 ) {
        store.set(from, {
            numero: store.get(from).numero,
            hora: moment(new Date()).format('h:mm:ss a'),
            fecha: moment(new Date()),
            Primeravez: 'S'
        })
    }



}





    if (Math.abs(moment(store.get(from).hora, "h:mm:ss a").diff(moment(new Date(), 'h:mm:ss a'), 'minutes')) >= 60 || moment.duration(moment(new Date()).diff(store.get(from).fecha)).asDays() >= 1) {

        peticioneswhatasapp(store.get(from).numero, "Esta conversación ha sido terminada por ausencia prolongada 💤, para reanudarla escríbenos ⌨️ nuevamente.", "Text")
        store.remove(from)
        return
    }

 
 

    if (store.get(from).Primeravez == 'S') {

        //  const contact = await msg.getContact()
        var message = "*Bienvenid@ a tu COOPIO XII*. " +
            "\nPor este medio podrás consultar información sobre nuestras oficinas, canales transaccionales y reportar consignaciones para ser aplicadas a tus productos de una forma ágil, al gestionar tu reporte recibirás un mensaje de texto informándote sobre su estado." +
            "\nSelecciona la opción correspondiente en cada uno de los pasos. Podrás terminar el proceso en cualquier momento escribiendo 'salir' o Volver al menú inicial escribiendo 'inicio o menú.' "

        var options1 = {
            url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
            method: 'POST',
            JSON: true,
            headers: headers,
            rejectUnauthorized: false,
            body: JSON.stringify(
                {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": store.get(from).numero,
                    "type": "interactive",
                    "interactive": {
                        "type": "list",
                        "header": {
                            "type": "text",
                            "text": "¡HOLA!"
                        },
                        "body": {
                            "text": message
                        },
                        "footer": {
                            "text": "Selecciona la palabra Menú"
                        },
                        "action": {
                            "button": "Menú 👆🏻",
                            "sections": [
                                {
                                    "title": "Selecciona:",
                                    "rows": [
                                        {
                                            "id": "1",
                                            "title": "Reportar Consignación.",
                                            "description": "Reporta el pago de créditos y ahorros."
                                        },
                                        {
                                            "id": "2",
                                            "title": "Sucursal Virtual",
                                            "description": "Consulta saldos y realiza pagos."
                                        }
                                        ,
                                        {
                                            "id": "3",
                                            "title": "App Asociados.",
                                            "description": "Descarga App Asociados."
                                        }
                                        ,
                                        {
                                            "id": "4",
                                            "title": "Información Oficinas.",
                                            "description": "Nuestras oficinas en todo el país"
                                        }
                                    ]
                                },
                             
                            ]
                        }
                    }
                }

            )
        }

        request(options1, function (error, response, body) {
            var prueba = body;
        });

        store.set(from, {
            numero: store.get(from).numero,
            paso: 1,
            token: '0',
            nit: 0,
            hora: store.get(from).hora,
            //   numceluescribe: contact.number,
            fecha: store.get(from).fecha,
            intentosMenu: 0,
        })

        return
    }

    if (store.get(from).paso == 1 && store.get(from).numero == from) {
        var entro = 'N'
        // if(store.get(from).data.length > 13)
        if(store.get(from).data.length >= 16)
        {
        if (store.get(from).data[15].indexOf("Reportar Consignación.") >= 0 && store.get(from).numero == from) {
            //const contact = await msg.getContact()

            var message = "Tus datos serán tratados de acuerdo con nuestra política de privacidad y protección de datos personales, puedes consultarla en el siguiente enlace: https://bit.ly/3HNxz33 " +
                "\nAdemás de nuestras políticas de uso del servicio Bot WhatsApp - ver política en el siguiente enlace: http://bit.ly/3CXCb5q"
            "\n¿aceptas nuestras políticas?"

            var options1 = {
                url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                method: 'POST',
                JSON: true,
                headers: headers,
                rejectUnauthorized: false,
                body: JSON.stringify(

                    {
                        "messaging_product": "whatsapp",
                        "recipient_type": "individual",
                        "to": store.get(from).numero,
                        "type": "interactive",
                        "interactive": {
                            "type": "button",
                            "body": {
                                "text": message
                            },
                            "action": {
                                "buttons": [
                                    {
                                        "type": "reply",
                                        "reply": {
                                            "id": "A",
                                            "title": "Aceptar"
                                        }
                                    },
                                    {
                                        "type": "reply",
                                        "reply": {
                                            "id": "R",
                                            "title": "Rechazar"
                                        }
                                    }
                                ]
                            }
                        }
                    }


                )
            }
            request(options1, function (error, response, body) {
                var prueba = body;
            });



            // sendMessage(msg.from, button);
            store.set(from, {
                numero: store.get(from).numero,
                paso: 1,
                hora: store.get(from).hora,
                numceluescribe: store.get(from).numero,
                fecha: store.get(from).fecha,
                body: "Reportar Consignación."
            })

            return
        }

        if (store.get(from).body == 'Reportar Consignación.' && store.get(from).numero == from) {

            if (store.get(from).data[15].indexOf("Aceptar") >= 0 && store.get(from).numero == from) {

                peticioneswhatasapp(store.get(from).numero, "Digita el número de tu documento de identidad sin puntos o caracteres especiales.⌨️")
                store.set(from, {
                    opcion: '1',
                    numero: store.get(from).numero,
                    paso: 2,
                    hora: store.get(from).hora,
                    numceluescribe: store.get(from).numero,
                    fecha: store.get(from).fecha,
                    intentoscedula: 0
                })
                return
            }
            else {
                peticioneswhatasapp(store.get(from).numero, "Fue un placer atenderte, gracias por utilizar nuestros servicios.\nIngresa a nuestra sucursal virtual 🖥️ aquí https://bit.ly/3mgcBQM,\ndescarga la app asociados 📱 para Android aquí https://bit.ly/3pXCshr\npara IOS aquí https://apple.co/3w2JTWS podrás informarte, consultar tus saldos y realizar transacciones, te esperamos de nuevo...😊")
                store.remove(from)
                return
            }
        }

        if (store.get(from).data[15].indexOf("Sucursal Virtual") >= 0 && store.get(from).numero == from) {
            var message = "Ingresa a nuestra sucursal virtual, podrás realizar consulta de saldos, consultar transacciones y realizar pagos a tus productos de ahorro y crédito. aquí https://bit.ly/3mgcBQM  🖥️"

            var options1 = {
                url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                method: 'POST',
                JSON: true,
                headers: headers,
                rejectUnauthorized: false,
                body: JSON.stringify(

                    {
                        "messaging_product": "whatsapp",
                        "recipient_type": "individual",
                        "to": store.get(from).numero,
                        "type": "interactive",
                        "interactive": {
                            "type": "button",
                            "body": {
                                "text": message
                            },
                            "action": {
                                "buttons": [
                                    {
                                        "type": "reply",
                                        "reply": {
                                            "id": "1",
                                            "title": "Salir"
                                        }
                                    },
                                    {
                                        "type": "reply",
                                        "reply": {
                                            "id": "2",
                                            "title": "Volver al inicio"
                                        }
                                    }
                                ]
                            }
                        }
                    }


                )
            }
            request(options1, function (error, response, body) {
                var prueba = body;
            });


            return
        }

        if (store.get(from).data[15].indexOf("App Asociados.") >= 0 && store.get(from).numero == from) {
            var message = "Ingresa a nuestra App Asociados, podrás realizar consulta de saldos, movimientos y realizar pagos a tus productos de ahorro y crédito. descárgala para Android aquí https://bit.ly/3pXCshr y para IOS aquí https://apple.co/3w2JTWS "

            var options1 = {
                url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                method: 'POST',
                JSON: true,
                headers: headers,
                rejectUnauthorized: false,
                body: JSON.stringify(

                    {
                        "messaging_product": "whatsapp",
                        "recipient_type": "individual",
                        "to": store.get(from).numero,
                        "type": "interactive",
                        "interactive": {
                            "type": "button",
                            "body": {
                                "text": message
                            },
                            "action": {
                                "buttons": [
                                    {
                                        "type": "reply",
                                        "reply": {
                                            "id": "1",
                                            "title": "Salir"
                                        }
                                    },
                                    {
                                        "type": "reply",
                                        "reply": {
                                            "id": "2",
                                            "title": "Volver al inicio"
                                        }
                                    }
                                ]
                            }
                        }
                    }


                )
            }
            request(options1, function (error, response, body) {
                var prueba = body;
            });

            return

        }

        if (store.get(from).data[15].indexOf("Información Oficinas.") >= 0 && store.get(from).numero == from) {

            oficinas()
            return

        }
    }
        if (store.get(from).intentosMenu < 3) {
            store.set(from, {
                numero: store.get(from).numero,
                paso: 1,
                token: '0',
                nit: 0,
                hora: store.get(from).hora,
                numceluescribe: store.get(from).numceluescribe,
                fecha: store.get(from).fecha,
                intentosMenu: store.get(from).intentosMenu + 1
            })
            peticioneswhatasapp(store.get(from).numero, "Tu selección fue incorrecta debes de dar click en la palabra menu. Por favor intenta nuevamente...😢")
              }
        else {
            peticioneswhatasapp(store.get(from).numero, "Realiza el proceso de nuevo, ya que, excediste el límite de 3 intentos para seleccionar la opcion correcta...")
            store.remove(from)
            return
        }
    }


    if (store.get(from).paso == 2 && store.get(from).numero == from && store.get(from).opcion == '1') {
        const regex = /^[0-9]*$/;
        const onlyNumbers = regex.test(store.get(from).data[10].substring(10,30))

        if (onlyNumbers == true) {

            var cadena = "SELECT id,a.celular, a.email,a.nombre1 FROM CRM_NITS a WHERE a.nro_documento = '" + store.get(from).data[10].substring(10,30) +"'"
            model.consulta("", cadena)
                .then(function (data) {
                    var guid = convertLetterToNumber(createGuid()).toString();

                    if (data.length > 0 && store.get(from).numero == from) {
                        // if (data.length > 0) {
                        var celular = "57" + data[0].celular
                        if (celular != store.get(from).numero) {

                            peticioneswhatasapp(store.get(from).numero, "Debes actualizar tus datos en una de nuestras oficinas para poder realizar este proceso y luego intenta nuevamente")
                            store.remove(from)
                            return
                        } else {
                            var guid = convertLetterToNumber(createGuid()).toString();

                            store.set(from, {
                                opcion: '1',
                                numero: store.get(from).numero,
                                paso: 3,
                                token: guid.substring(3, 9),
                                nit: store.get(from).data[10].substring(10,30),
                                validacuenta: 'N',
                                hora: store.get(from).hora,
                                fecha: store.get(from).fecha,
                                intentos: 0,
                                intentoscuenta: 0
                            })
                            if(data[0].email.length > 0)
                            {
                            enviarEmail.enviarmail(data[0].email, 'Auto Gestión Whatsapp:', "Tu código de confirmación para atención por Whatsapp es: " + guid.substring(3, 9))
                            }
                            enviarsms.enviarsms(data[0].id, "DE COOPIO XII: " + data[0].nombre1 + " tu código de confirmación para atencion por Whatsapp es: " + guid.substring(3, 9))
                          
                            peticioneswhatasapp(store.get(from).numero, "Hemos enviado un código de seguridad a tu correo 📧 y a tu celular 📲, por favor digitalo.⌨️")
                            
                        }
                    } else {


                        if (store.get(from).intentoscedula < 3) {

                            store.set(from, {
                                opcion: '1',
                                numero: store.get(from).numero,
                                paso: 2,
                                nit: 0,
                                hora: store.get(from).hora,
                                numceluescribe: store.get(from).numceluescribe,
                                fecha: store.get(from).fecha,
                                intentoscedula: store.get(from).intentoscedula + 1
                            })
                            peticioneswhatasapp(store.get(from).numero, "Tu número de identificación es incorrecto. Por favor intenta nuevamente...")
                            
                            return
                        }
                        else {
                            peticioneswhatasapp(store.get(from).numero, "Realiza el proceso de nuevo, ya que, excediste el límite de 3 intentos al ingresar tu número de identificacion o también puede ser necesario actualizar tus datos en una de nuestras oficinas para poder realizar este proceso y luego intenta nuevamente...")
                            store.remove(from)
                            return

                        }
                    }
                })
                .catch(function (err) {
                    console.dir(err);
                    var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                    sql.log("Error", message);
                });

        } else {

            //  intentoscedula = intentoscedula + 1
            if (store.get(from).intentoscedula < 3) {
                store.set(from, {
                    opcion: '1',
                    numero: from,
                    paso: 2,
                    nit: 0,
                    hora: store.get(from).hora,
                    numceluescribe: store.get(from).numceluescribe,
                    fecha: store.get(from).fecha,
                    intentoscedula: store.get(from).intentoscedula + 1
                })
                peticioneswhatasapp(store.get(from).numero, "Tu número de identificación es incorrecto. Por favor intenta nuevamente digitando solo números, no utilices letras, espacios o caracteres especiales.")
                 return
            }
            else {
                peticioneswhatasapp(store.get(from).numero, "Realiza el proceso de nuevo, ya que, excediste el límite de 3 intentos al ingresar tu número de identificacion o también puede ser necesario actualizar tus datos en una de nuestras oficinas para poder realizar este proceso y luego intenta nuevamente...")
                store.remove(from)
                return
            }

        }

    }



    if (store.get(from).paso == 3 && store.get(from).numero == from && store.get(from).opcion == '1') {
        if (store.get(from).validacuenta == 'N' && store.get(from).token == store.get(from).data[10].substring(10,30)) {
            var message = "Selecciona la cuenta donde realizaste la consignación"
           
           
           
            var options1 = {
                url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                method: 'POST',
                JSON: true,
                headers: headers,
                rejectUnauthorized: false,
                body: JSON.stringify(
                    {
                        "messaging_product": "whatsapp",
                        "recipient_type": "individual",
                        "to": store.get(from).numero,
                        "type": "interactive",
                        "interactive": {
                            "type": "list",
                            "header": {
                                "type": "text",
                                "text": "Cuentas Bancarias"
                            },
                            "body": {
                                "text": message
                            },
                            "footer": {
                                "text": "Selección de cuenta:"
                            },
                            "action": {
                                "button": "Seleccionar cuenta 👆🏻",
                                "sections": [
                                    {
                                        "title": "Selecciona:",
                                        "rows": [
                                            {
                                                "id": "1",
                                                "title": "61609712690",
                                                "description": "Cta. Crte. Bancolombia-Convenio:36527"
                                            },
                                            {
                                                "id": "2",
                                                "title": "61650302301",
                                                "description": "Cta. Crte. Bancolombia-Convenio:30489"
                                            }
                                            ,
                                            {
                                                "id": "3",
                                                "title": "61623053987",
                                                "description": "Cta. Crte. Bancolombia"
                                            }
                                            ,
                                            {
                                                "id": "4",
                                                "title": "04564208494",
                                                "description": "Cta. Crte. Bancolombia-Convenio:36526"
                                            }
                                            ,
                                            {
                                                "id": "5",
                                                "title": "531016921",
                                                "description": "Cta. Ahorros Banco de Bogotá-Convenio:0388"
                                            }
                                            ,
                                            {
                                                "id": "6",
                                                "title": "056169998889",
                                                "description": "Cta. Crte. Davivienda"
                                            }
                                            ,
                                            {
                                                "id": "7",
                                                "title": "13720000192",
                                                "description": "Cta. Crte. Banco Agrario"
                                            }
                                            ,
                                            {
                                                "id": "8",
                                                "title": "757006481",
                                                "description": "Cta. Crte. Banco BBVA"
                                            }
                                            ,
                                            {
                                                "id": "9",
                                                "title": "21002639502",
                                                "description": "Cta. Crte. Banco Caja Social"
                                            }
                                            ,
                                            {
                                                "id": "10",
                                                "title": "036869999650",
                                                "description": "Cta. Crte. Davivienda"
                                            }
                                                                              
                                        ]
                                    },
                                    // {
                                    //     "title": "<LIST_SECTION_2_TITLE>",
                                    //     "rows": [
                                    //         {
                                    //             "id": "<LIST_SECTION_2_ROW_1_ID>",
                                    //             "title": "<SECTION_2_ROW_1_TITLE>",
                                    //             "description": "<SECTION_2_ROW_1_DESC>"
                                    //         },
                                    //         {
                                    //             "id": "<LIST_SECTION_2_ROW_2_ID>",
                                    //             "title": "<SECTION_2_ROW_2_TITLE>",
                                    //             "description": "<SECTION_2_ROW_2_DESC>"
                                    //         }
                                    //     ]
                                    // }
                                ]
                            }
                        }
                    }
    
                )
            }
    
            request(options1, function (error, response, body) {
                var prueba = body;
            });
               
            var cadenacuentas = "1 Cta. Crte. Bancolombia:61609712690 Convenio:36527\n2 Cta. Crte. Bancolombia:61650302301 Convenio:30489\n3 Cta. Crte. Bancolombia:61623053987\n4 Cta. Crte. Bancolombia: 04564208494 Convenio:36526\n5 Cta. Ahorros Banco de Bogotá:531016921 Convenio:0388\n6 Cta. Crte. Davivienda:056169998889\n7 Cta. Crte. Banco Agrario:13720000192\n8 Cta. Crte. Banco BBVA:757006481\n9 Cta. Crte. Banco Caja Social:21002639502\n10 Cta. Crte. Davivienda:036869999650"
    
            store.set(from, {
                opcion: '1',
                numero: store.get(from).numero,
                paso: 3,
                token: store.get(from).token,
                nit: store.get(from).nit,
                validacuenta: 'S',
                tokenvalida: store.get(from).data[10].substring(10,30),
                cuentas: cadenacuentas,
                hora: store.get(from).hora,
                fecha: store.get(from).fecha,
                intentoscuenta: 0
            })
            return
        }
    
        if (store.get(from).token == store.get(from).tokenvalida && store.get(from).numero == from) {
            let arrcuentas = store.get(from).cuentas.split('\n');
            var iniciocuentas = 0
            var finalcuentas = arrcuentas.length
            var codigocuenta = 0
            var cuenta = ''
            var entracuenta = 'N'

            if(store.get(from).data.length > 13)
{
            var cuentaviene = store.get(from).data[14].replace(/[^0-9]+/g, "");
}


            while (iniciocuentas >= 0 && iniciocuentas < finalcuentas) {
    
                codigocuenta = arrcuentas[iniciocuentas].substring(0,2).replace(" ","")
    
                if (codigocuenta == cuentaviene) {
                    cuenta = arrcuentas[iniciocuentas]
                    entracuenta = 'S'
                }
    
                iniciocuentas++
            }
    
            if (entracuenta == 'N') {
    
                if (store.get(from).intentoscuenta <= 3) {
                    store.set(from, {
                        opcion: '1',
                        numero: store.get(from).numero,
                        paso: 3,
                        token: store.get(from).token,
                        nit: store.get(from).nit,
                        validacuenta: 'S',
                        tokenvalida: store.get(from).tokenvalida,
                        cuentas: store.get(from).cuentas,
                        hora: store.get(from).hora,
                        fecha: store.get(from).fecha,
                        intentoscuenta: store.get(from).intentoscuenta + 1
                    })
    
                    peticioneswhatasapp(store.get(from).numero, "Tu selección fue incorrecta. Por favor intenta nuevamente...😢")
                 return
                }
                else {
                    peticioneswhatasapp(store.get(from).numero, "Realiza el proceso de nuevo, ya que, excediste el límite de 3 intentos para seleccionar la cuenta en la que realizaste tu consignación")
                    store.remove(from)
                    return
    
                }
           
            }
            
            var cadena = "select linea_credito + ' ' +  nro_pagare  as nro_pagare from crm_creditos WHERE saldo_capital > 0  and nro_documento = '" + store.get(from).nit + "'" + "union " +
                "select 'ROTATIVO' + ' ' +  linea_credito + ' ' +  padre_rotativo as nro_pagare from crm_avances_rotativo WHERE saldo_capital > 0 and nro_documento = '" + store.get(from).nit + "' group by linea_credito,padre_rotativo union " +
                "select linea_ahorro + ' ' + nro_cuenta  from crm_ahorros_vista where  estado <> 'c' AND  nro_documento = '" + store.get(from).nit + "' UNION " +
                "select linea_ahorro + ' ' + nro_cuenta  from crm_ahorros_contractual where year(fecha_inicio)>= year(getdate())-2 AND estado <> 'c' AND nro_documento = '" + store.get(from).nit + "' UNION " +
                "select   nombre_novedad from crm_novedades_varias_causadas where saldo> 0 AND nro_documento = '" + store.get(from).nit + "' UNION " +
                "select   nombre_novedad from crm_novedades_varias_no_causadas where  saldo> 0 AND nro_documento = '" + store.get(from).nit + "'"
    
            model.consulta("", cadena)
                .then(function (datapagares) {
                    if (datapagares.length == 0) {
                      
                        peticioneswhatasapp(store.get(from).numero, "No se encontró ningún producto. Por favor verifica con tu entidad ...")                        
                        store.remove(from)
                        return
                    }
    
                    var iniciopagares = 0
                    var finpagares = datapagares.length
                    var cadena = ""
                    contador = 0
                    var contadorultimo = 0
    
                    while (iniciopagares >= 0 && iniciopagares < finpagares) {
                        contador = contador + 1
                        cadena = cadena + contador + ". " + datapagares[iniciopagares].nro_pagare + "\n"
                      
                        iniciopagares++
                    }
                    if (finpagares != 1) {
    
                        contador++
                        cadena = cadena + contador + ". FUNERARIA LOS OLIVOS\n"
                        contador++
                        cadena = cadena + contador + ". POLIZA PIO PROTECCIÓN\n"
                        contador++
                        cadena = cadena + contador + ". ABONO A VARIOS PRODUCTOS"
                    }
                    peticioneswhatasapp(store.get(from).numero, "Elige el producto al que deseas reportar el pago : \n" + cadena)                        
                    peticioneswhatasapp(store.get(from).numero, "Digita el valor a abonar para cada producto sin espacios, letras o caracteres especiales, digita 0 cuando no quieras aplicar abono a alguno de los productos, te preguntaremos por el valor que quieres abonar a cada uno de ellos")                        
                    
                    store.set(from, {
                        opcion: '1',
                        numero: store.get(from).numero,
                        paso: 4,
                        nit: store.get(from).nit,
                        cadena: cadena.split('\n'),
                        contador: contador,
                        cuenta: cuenta,
                        hora: store.get(from).hora,
                        fecha: store.get(from).fecha,
                        intentosPagare: 0
    
                    })
                })
                .catch(function (err) {
                    console.dir(err);
                    var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                    sql.log("Error", message);
                });
        } else {
    
            if (store.get(from).intentos == 3) {
                
                peticioneswhatasapp(store.get(from).numero, "Código de seguridad incorrecto. Por favor genera tu código nuevamente...😎")                        
                store.remove(from)
                return
            } else {
                var cuantos = 3 - store.get(from).intentos
                store.set(from, {
                    opcion: '1',
                    numero: store.get(from).numero,
                    paso: 3,
                    nit: store.get(from).nit,
                    cadena: "",
                    intentos: store.get(from).intentos + 1,
                    token: store.get(from).token,
                    cuenta: 0,
                    validacuenta: 'N',
                    hora: store.get(from).hora,
                    fecha: store.get(from).fecha
                })
                peticioneswhatasapp(store.get(from).numero, "Código de seguridad incorrecto. Por favor intenta nuevamente, te quedan  " + cuantos + " intentos") 
                 return
            }
    
        }
    }
    
       // Adicionar opción para que el asociado pueda elegir varios pagaré, y solicitar monto por cada uno de ellos.

                // debe dar 3 oportunidades para digitar el código de seguridad 

                if (store.get(from).paso == 4 && store.get(from).numero == from && store.get(from).opcion == '1') {

                    var iniciop = 0

                       if (store.get(from).contador.toString() == store.get(from).data[10].replace(/[^0-9]+/g, "")) {
                        store.set(from, {
                            opcion: '1',
                            numero: store.get(from).numero,
                            paso: 5,
                            nit: store.get(from).nit,
                            pagare: store.get(from).cadena[iniciop],
                            contador: store.get(from).contador.toString(),
                            pagareabona: store.get(from).cadena[iniciop],
                            cadena: store.get(from).cadena,
                            cuenta: store.get(from).cuenta,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            cadenaguardavalores: "",
                            cadenalineasaguardar: "",
                            ultimoregistro: store.get(from).data[10].replace(/[^0-9]+/g, "")
                        })
                        peticioneswhatasapp(store.get(from).numero, "Digita el valor que deseas abonar para el producto " + store.get(from).cadena[iniciop] + " sin puntos o caracteres especiales") 
                        return

                    } else {



                        // const regex = /^[0-9]*$/;
                        // const onlyNumbers = regex.test(store.get(from).data[10].replace(/[^0-9]+/g, ""))
                
                        // if (onlyNumbers == true) {


                        while (iniciop >= 0 && iniciop < store.get(from).cadena.length) {
                           if (store.get(from).cadena[iniciop].substring(0, 2).replace(".","")  == store.get(from).data[10].replace(/[^0-9]+/g, "") && store.get(from).cadena[iniciop].substring(0, 2).replace(/(.)/gm, "") != " "   ) {
                                store.set(from, {
                                    opcion: '1',
                                    numero: store.get(from).numero,
                                    paso: 5,
                                    nit: store.get(from).nit,
                                    pagare: store.get(from).cadena[iniciop],
                                    contador: '0',
                                    cadena: store.get(from).cadena,
                                    cuenta: store.get(from).cuenta,
                                    hora: store.get(from).hora,
                                    fecha: store.get(from).fecha,
                                    data: store.get(from).data,
                                    cadenaguardavalores: "",
                                    cadenalineasaguardar: "",
                                    entra: "S",
                                    otralinea: "N"
                                })

                           
                            peticioneswhatasapp(store.get(from).numero, "Digita el valor que deseas abonar para el producto " + store.get(from).cadena[iniciop] + " sin puntos o caracteres especiales") 
                            return
                        }
                            iniciop++
                        }

                        if (store.get(from).entra == 'N' || store.get(from).entra == undefined) {
                             if (store.get(from).intentosPagare <= 3) {
                                store.set(from, {
                                    opcion: '1',
                                    numero: store.get(from).numero ,
                                    paso: 4,
                                    nit: store.get(from).nit,
                                    cadena: store.get(from).cadena,
                                    contador: store.get(from).contador,
                                    cuenta: store.get(from).cuenta,
                                    hora: store.get(from).hora,
                                    fecha: store.get(from).fecha,
                                    intentosPagare: store.get(from).intentosPagare + 1,
                                    intentos: 0

                                })
                                peticioneswhatasapp(store.get(from).numero, "Selección de producto incorrecta. Por favor intenta nuevamente...😢") 
                                return
                            }
                            else {
                                peticioneswhatasapp(store.get(from).numero, "Realiza el proceso de nuevo. Excediste el límite de 3 intentos para realizar la selección de producto") 
                                store.remove(from)
                                return
                            }

                        } 
                    }
                }
                if (store.get(from).paso == 5 && store.get(from).numero == from && store.get(from).opcion == '1') {
                    var tieneletras = tiene_letras(store.get(from).data[10].substring(10,20))
                    if (tieneletras == 1) {

                        if (store.get(from).intentos == 2) {
                            peticioneswhatasapp(store.get(from).numero, "Realiza el proceso de nuevo ya que excediste el límite de 3 intentos para el ingreso del valor") 
                            store.remove(from)
                             return
                        }
                        else {
                          
                            store.set(from, {
                                opcion: '1',
                                numero: store.get(from).numero,
                                paso: 5,
                                nit: store.get(from).nit,
                                pagare: store.get(from).pagare,
                                contador: store.get(from).contador,
                                cadena: store.get(from).cadena,
                                cadenaguardavalores: store.get(from).cadenaguardavalores ,
                                cadenalineasaguardar: store.get(from).cadenalineasaguardar,
                                cuenta: store.get(from).cuenta,
                                hora: store.get(from).hora,
                                fecha: store.get(from).fecha,
                                ultimoregistro: store.get(from).ultimoregistro,
                                intentos: store.get(from).intentos + 1
                            })
                            peticioneswhatasapp(store.get(from).numero, "El Valor contiene espacios, letras o caracteres especiales por favor digita solo números, intenta nuevamente...😢") 
                            

                        }

                        return
                    }

                   
                    if (store.get(from).contador == store.get(from).ultimoregistro) {
                        var iniciop = 0                   
                        while (iniciop >= 0 && iniciop < store.get(from).cadena.length) {
                            if (store.get(from).contador == store.get(from).cadena[iniciop].substring(0, 2).replace('.','')) {
                                store.set(from, {
                                    opcion: '1',
                                    numero: store.get(from).numero,
                                    paso: 6,
                                    nit: store.get(from).nit,
                                    pagare: store.get(from).cadenalineasaguardar + store.get(from).pagare.substring(2, store.get(from).pagare.length) + ' | ',
                                    valor: store.get(from).cadenaguardavalores + store.get(from).data[10].replace(/[^0-9]+/g, "") + ' | ',
                                    cuenta: store.get(from).cuenta,
                                    hora: store.get(from).hora,
                                    fecha: store.get(from).fecha,
                                    ultimoregistro: store.get(from).ultimoregistro,
                                    intentos: 0,
                                    posicionextencion: 0,
                                    extencion: 0
                                })
                                peticioneswhatasapp(store.get(from).numero, "Adjunta tu recibo de consignación:" +
                                "\n• Toma una foto 📷 " +
                                "\n• Adjunta imagen 🏞️") 
                            
                                return
                            } else {

                                if (store.get(from).cadena[iniciop] == store.get(from).pagare) {

                                    iniciop++
                                    if (store.get(from).contador != store.get(from).cadena[iniciop].substring(0, 2).replace('.','')) {
                                        store.set(from, {
                                            opcion: '1',
                                            numero: store.get(from).numero,
                                            paso: 5,
                                            nit: store.get(from).nit,
                                            pagare: store.get(from).cadena[iniciop],
                                            contador: store.get(from).contador,
                                            cadena: store.get(from).cadena,
                                            cadenaguardavalores: store.get(from).cadenaguardavalores + store.get(from).data[10].replace(/[^0-9]+/g, "") + ' | ',
                                            cadenalineasaguardar: store.get(from).cadenalineasaguardar + store.get(from).pagare.substring(2, store.get(from).pagare.length) + ' | ',
                                            cuenta: store.get(from).cuenta,
                                            hora: store.get(from).hora,
                                            fecha: store.get(from).fecha,
                                            ultimoregistro: store.get(from).ultimoregistro,
                                            intentos: 0
                                        })
                                        peticioneswhatasapp(store.get(from).numero, "Digita el valor que deseas abonar para el producto " + store.get(from).cadena[iniciop] + " sin puntos o caracteres especiales") 
                                       
                                        return
                                    } else {
                                        iniciop--

                                    }





                                }
                            }
                            iniciop++
                        }
                    }
                    else {

                        store.set(from, {
                            opcion: '1',
                            numero: store.get(from).numero,
                            paso: 6,
                            nit: store.get(from).nit,
                            pagare: store.get(from).pagare.substring(2, 50),
                            valor: store.get(from).data[10].replace(/[^0-9]+/g, ""),
                            cuenta: store.get(from).cuenta,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            ultimoregistro: store.get(from).ultimoregistro,
                            intentos: 0,
                            posicionextencion: 0,
                            extencion: 0
                        })


                        peticioneswhatasapp(store.get(from).numero, "Adjunta tu recibo de consignación:" +
                        "\n• Toma una foto 📷 " +
                        "\n• Adjunta imagen 🏞️") 
                    }
                    return
                }



                if (store.get(from).paso == 6 && store.get(from).numero == from && store.get(from).opcion == '1') {

                    if (store.get(from).data[10].indexOf("image") >= 0 || store.get(from).data[10].indexOf("document") >= 0 || store.get(from).data[11].indexOf("image") >= 0) {
                

                                if (store.get(from).data.length == 15)
                                { 
                                    store.set(from, {
                                        opcion: '1',
                                        numero: store.get(from).numero,
                                        paso: 6,
                                        nit: store.get(from).nit,
                                        pagare: store.get(from).pagare,
                                        valor: store.get(from).valor,
                                        cuenta: store.get(from).cuenta,
                                        hora: store.get(from).hora,
                                        fecha: store.get(from).fecha,
                                        data: store.get(from).data,
                                        ultimoregistro: store.get(from).ultimoregistro,
                                        intentos: 0,                                        
                                        extencion: store.get(from).data[11].substring(store.get(from).data[11].search("/") + 1,store.get(from).data[11].search("/") + 7)
                                    })


                                    
                                }else 
                                {
                                    
                                    store.set(from, {
                                        opcion: '1',
                                        numero: store.get(from).numero,
                                        paso: 6,
                                        nit: store.get(from).nit,
                                        pagare: store.get(from).pagare,
                                        valor: store.get(from).valor,
                                        cuenta: store.get(from).cuenta,
                                        hora: store.get(from).hora,
                                        fecha: store.get(from).fecha,
                                        data: store.get(from).data,
                                        ultimoregistro: store.get(from).ultimoregistro,
                                        intentos: 0,
                                        extencion: store.get(from).data[12].substring(store.get(from).data[12].search("/") + 1,store.get(from).data[12].search("/") + 7)
                                    })
                                }
                                var guidradicado = createGuid();
                                guidradicado = guidradicado.substring(0, 8)
        

                                var moment = require("moment");
                                var cuenta = store.get(from).cuenta.substring(2, 100)
                                var pagare = store.get(from).pagare
                                var nit = store.get(from).nit
                                var Valor = store.get(from).valor
                                var dat = new Date();
                                dat = moment(dat).format('YYYY/MM/DD/HH:mm:ss')
                                dat = dat.replace(/["/"]/g, "-");
                                dat = dat.replace(/[":"]/g, "");
                                var filename = ""
        
                                if (store.get(from).data[13].substring(3, 100).replace("]","") == undefined) {
                                    filename = guidradicado + '-' + nit + '-' + dat + '.jpg'
                                } else {

                                    if (store.get(from).data.length == 15)
                                { 
                                    filename = guidradicado + '-' + nit + '-' + dat + "." + store.get(from).extencion  
                                }else 
                                {
                                    filename = guidradicado + '-' + nit + '-' + dat + "." + store.get(from).extencion  

                                }

                                }
        
                                if (store.get(from).data.length == 15)
                                { 
                                var options = {
                                    url: 'https://graph.facebook.com/v16.0/' + store.get(from).data[13].substring(3, 100).replace("]",""),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                                    method: 'GET',
                                    JSON: true,
                                    headers: headers,
                                    rejectUnauthorized: false,                     
                                }
                            }else{

                                var options = {
                                    url: 'https://graph.facebook.com/v16.0/' + store.get(from).data[14].substring(3, 100).replace("]",""),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                                    method: 'GET',
                                    JSON: true,
                                    headers: headers,
                                    rejectUnauthorized: false,                     
                                }

                            }

                                request(options, function (error, response, body) {
                                    
                            
                              let strI = JSON.stringify(body).replace(/(")/gm, "")
                              strI = JSON.stringify(strI).replace(/(\\)/gm, "")
                                ststrIr = JSON.stringify(strI).replace(/([{}])/gm, "")
                            
                            
                                let arrI = ststrIr.split(',');
                            
                                    var options = {
                                        url: arrI[0].substring(7,500),
                                        method: 'GET',
                                        JSON: true,
                                        headers: headers,
                                        rejectUnauthorized: false,                     
                                    }
                                   // request('http://google.com/doodle.png').pipe(fs.createWriteStream('doodle.png'))
                                    request(options, function (error, response, obody) {
                            
                            if (error) {
                                console.log(error);
                                
                    peticioneswhatasapp(store.get(from).numero, 'No se generó radicado, hubo un problema al recibir tu reporte. Por favor verifica con tu entidad ... ❌') 
                    
                                store.remove(from)
                                return
                            } else {

                                var cadenalog = "insert into crm_consignaciones_reportadas (Nro_documento,Canal,Producto,Fecha,Valor,Estado_banco,Estado_Opa,Adjunto,radicado,banco_consignacion,user_id,comentario_adjunto) " +
                                    "values('" + nit + "','WHATSAPP','" + pagare + "',GETDATE(),'" + Valor + "','PENDIENTE','PENDIENTE','/img/wsp/" + filename + "','" + guidradicado + "','" + cuenta + "' ,'181','" + store.get(from).data[11].substring(14, 100) + "')"

                                model.consulta("", cadenalog)
                                    .then(function (datalog) {
                                        peticioneswhatasapp(store.get(from).numero, `Tu reporte de consignación ha finalizado correctamente. \n • Tu radicado es : ` + guidradicado + " 👍🏻") 
                                        peticioneswhatasapp(store.get(from).numero, `Fue un placer atenderte, gracias por utilizar nuestros servicios.\nIngresa a nuestra sucursal virtual 🖥️ aquí https://bit.ly/3mgcBQM,\ndescarga la app asociados 📱 para Android aquí https://bit.ly/3pXCshr\npara IOS aquí https://apple.co/3w2JTWS podrás informarte, consultar tus saldos y realizar transacciones, te esperamos de nuevo...😊`) 
                                                               
                                        store.remove(from)
                                    })
                                    .catch(function (err) {
                                        console.dir(err);
                                        var message = "\n\nMessage Error\n\n" + JSON.stringify(err, null, 4);
                                        sql.log("Error", message);
                                        peticioneswhatasapp(store.get(from).numero, 'No se generó radicado, hubo un problema al recibir tu reporte de consignación. Por favor verifica con tu entidad ...❌') 
                                        store.remove(from)
                                    });
                            }
                                                    



                                    }).pipe(fs.createWriteStream("../public/img/wsp/" + filename));
                            
                            
                            
                            
                            
                            
                                });

                 

                    } else {
                        peticioneswhatasapp(store.get(from).numero, 'No puedes enviar este tipo de dato, seguimos esperando tu soporte como foto(📷) o imagen(🏞️).') 
                        
                        return
                    }
                }

                if (store.get(from).paso == 7 && store.get(from).numero == from && store.get(from).opcion == '4') {
        
                    if(store.get(from).data.length >= 16)
                    {
                    if (store.get(from).data[15].indexOf("Antioquia") >= 0) {
                        var options1 = {
                            url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                            method: 'POST',
                            JSON: true,
                            headers: headers,
                            rejectUnauthorized: false,
                            body: JSON.stringify(
                                {
                                    "messaging_product": "whatsapp",
                                    "recipient_type": "individual",
                                    "to": store.get(from).numero,
                                    "type": "interactive",
                                    "interactive": {
                                        "type": "list",
                                        "header": {
                                            "type": "text",
                                            "text": "Oficinas COOPIO XII"
                                        },
                                        "body": {
                                            "text": "Departamento de Antioquia\n"+
                                                    "\n🏦Información general:"+
                                                    "\nUbicación, datos de contacto y horarios de atención."
                                        },
                                        // "footer": {
                                        //     "text": "🏪Información general de cada oficina:"
                                        // },
                                        "action": {
                                            "button": "Nuestras Oficinas:",
                                            "sections": [
                                                {
                                                    "title": "Selecciona:",
                                                    "rows": [
                                                        {
                                                            "id": "1",
                                                            "title": "Cocorná.",
                                                            "description": "Ver información oficina"
                                                        },
                                                        {
                                                            "id": "2",
                                                            "title": "Medellín.",
                                                            "description": "Ver información oficina"
                                                        }
                                                        ,
                                                        {
                                                            "id": "3",
                                                            "title": "Punto A. Monterrey.",
                                                            "description": "Ver información oficina"
                                                        }
                                                        ,
                                                        {
                                                            "id": "4",
                                                            "title": "Rionegro.",
                                                            "description": "Ver información oficina"
                                                        }
                                                        ,
                                                        {
                                                            "id": "6",
                                                            "title": "San Francisco.",
                                                            "description": "Ver información oficina"
                                                        }
                                                        ,
                                                        {
                                                            "id": "7",
                                                            "title": "Argelia.",
                                                            "description": "Ver información oficina"
                                                        }
                                                          ,
                                                        {
                                                            "id": "8",
                                                            "title": "Salir.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "10",
                                                            "title": "Ir a departamentos.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "11",
                                                            "title": "volver al inicio.",
                                                            "description": ""
                                                        }
                                                        
                                                    ]
                                                },
                                             
                                            ]
                                        }
                                    }
                                }
                
                            )
                        }                    
                    }

                    if (store.get(from).data[15].indexOf("Bolivar") >= 0) {
                        var options1 = {
                            url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                            method: 'POST',
                            JSON: true,
                            headers: headers,
                            rejectUnauthorized: false,
                            body: JSON.stringify(
                                {
                                    "messaging_product": "whatsapp",
                                    "recipient_type": "individual",
                                    "to": store.get(from).numero,
                                    "type": "interactive",
                                    "interactive": {
                                        "type": "list",
                                        "header": {
                                            "type": "text",
                                            "text": "Oficinas COOPIO XII"
                                        },
                                        "body": {
                                            "text": "Departamento de Bolivar\n"+
                                                    "\n🏦Información general:"+
                                                    "\nUbicación, datos de contacto y horarios de atención."
                                        },
                                        // "footer": {
                                        //     "text": "🏪Información general de cada oficina:"
                                        // },
                                        "action": {
                                            "button": "Nuestras Oficinas:",
                                            "sections": [
                                                {
                                                    "title": "Selecciona:",
                                                    "rows": [
                                                        {
                                                            "id": "1",
                                                            "title": "Cartagena.",
                                                            "description": "Ver información oficina"
                                                        }                                                      
                                                          ,
                                                        {
                                                            "id": "2",
                                                            "title": "Salir.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "3",
                                                            "title": "Ir a departamentos.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "4",
                                                            "title": "volver al inicio.",
                                                            "description": ""
                                                        }                                                        
                                                    ]
                                                },                                             
                                            ]
                                        }
                                    }
                                }                
                            )
                        }
                    }

                    
                    // if (store.get(from).data[15].indexOf("Bolivar") >= 0) {
                    //     var options1 = {
                    //         url: 'https://graph.facebook.com/v16.0/101952046249631/messages',  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                    //         method: 'POST',
                    //         JSON: true,
                    //         headers: headers,
                    //         rejectUnauthorized: false,
                    //         body: JSON.stringify(
                    //             {
                    //                 "messaging_product": "whatsapp",
                    //                 "recipient_type": "individual",
                    //                 "to": store.get(from).numero,
                    //                 "type": "interactive",
                    //                 "interactive": {
                    //                     "type": "list",
                    //                     "header": {
                    //                         "type": "text",
                    //                         "text": "Oficinas COOPIO XII"
                    //                     },
                    //                     "body": {
                    //                         "text": "Oficinas en Bolivar"
                    //                     },
                    //                     "footer": {
                    //                         "text": "*Información Oficinas:*🏪"
                    //                     },
                    //                     "action": {
                    //                         "button": "Nuestras Oficinas:",
                    //                         "sections": [
                    //                             {
                    //                                 "title": "Selecciona:",
                    //                                 "rows": [
                    //                                     {
                    //                                         "id": "1",
                    //                                         "title": "Cartagena.",
                    //                                         "description": "Selecciona el departamento de tu oficina"
                    //                                     }                                                      
                    //                                       ,
                    //                                     {
                    //                                         "id": "6",
                    //                                         "title": "Salir.",
                    //                                         "description": ""
                    //                                     }
                    //                                     ,
                    //                                     {
                    //                                         "id": "7",
                    //                                         "title": "Ir a departamentos.",
                    //                                         "description": ""
                    //                                     }
                    //                                     ,
                    //                                     {
                    //                                         "id": "8",
                    //                                         "title": "volver al inicio.",
                    //                                         "description": ""
                    //                                     }
                                                        
                    //                                 ]
                    //                             },
                                             
                    //                         ]
                    //                     }
                    //                 }
                    //             }
                
                    //         )
                    //     }
                     

                    // }

                    if (store.get(from).data[15].indexOf("Bogotá") >= 0) {
                        var options1 = {
                            url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                            method: 'POST',
                            JSON: true,
                            headers: headers,
                            rejectUnauthorized: false,
                            body: JSON.stringify(
                                {
                                    "messaging_product": "whatsapp",
                                    "recipient_type": "individual",
                                    "to": store.get(from).numero,
                                    "type": "interactive",
                                    "interactive": {
                                        "type": "list",
                                        "header": {
                                            "type": "text",
                                            "text": "Oficinas COOPIO XII"
                                        },
                                        "body": {
                                            "text": "Bogotá D.C.\n"+
                                            "\n🏦Información general:"+
                                            "\nUbicación, datos de contacto y horarios de atención."
                                },
                                // "footer": {
                                //     "text": "🏪Información general de cada oficina:"
                                // },
                                        "action": {
                                            "button": "Nuestras Oficinas:",
                                            "sections": [
                                                {
                                                    "title": "Selecciona:",
                                                    "rows": [
                                                        {
                                                            "id": "1",
                                                            "title": "Bogotá Kennedy.",
                                                            "description": "Ver información oficina"
                                                        },
                                                        {
                                                            "id": "2",
                                                            "title": "Bogotá Centro.",
                                                            "description": "Ver información oficina"
                                                        }                                                        
                                                          ,
                                                        {
                                                            "id": "3",
                                                            "title": "Salir.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "4",
                                                            "title": "Ir a departamentos.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "5",
                                                            "title": "volver al inicio.",
                                                            "description": ""
                                                        }                                                        
                                                    ]
                                                },
                                             
                                            ]
                                        }
                                    }
                                }                
                            )
                        }                   
                    }

                    if (store.get(from).data[15].indexOf("Sucre") >= 0) {
                        var options1 = {
                            url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                            method: 'POST',
                            JSON: true,
                            headers: headers,
                            rejectUnauthorized: false,
                            body: JSON.stringify(
                                {
                                    "messaging_product": "whatsapp",
                                    "recipient_type": "individual",
                                    "to": store.get(from).numero,
                                    "type": "interactive",
                                    "interactive": {
                                        "type": "list",
                                        "header": {
                                            "type": "text",
                                            "text": "Oficinas COOPIO XII"
                                        },
                                        "body": {
                                            "text": "Departamento de Sucre\n"+
                                            "\n🏦Información general:"+
                                            "\nUbicación, datos de contacto y horarios de atención."
                                },
                                // "footer": {
                                //     "text": "🏪Información general de cada oficina:"
                                // },
                                        "action": {
                                            "button": "Nuestras Oficinas:",
                                            "sections": [
                                                {
                                                    "title": "Selecciona:",
                                                    "rows": [
                                                        {
                                                            "id": "1",
                                                            "title": "Sincelejo.",
                                                            "description": "Ver información oficina"
                                                        } ,
                                                        {
                                                            "id": "2",
                                                            "title": "Salir.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "3",
                                                            "title": "Ir a departamentos.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "4",
                                                            "title": "volver al inicio.",
                                                            "description": ""
                                                        }
                                                        
                                                    ]
                                                },
                                             
                                            ]
                                        }
                                    }
                                }
                
                            )
                        }
                     

                    }



                    if (store.get(from).data[15].indexOf("Magdalena") >= 0) {
                        var options1 = {
                            url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                            method: 'POST',
                            JSON: true,
                            headers: headers,
                            rejectUnauthorized: false,
                            body: JSON.stringify(
                                {
                                    "messaging_product": "whatsapp",
                                    "recipient_type": "individual",
                                    "to": store.get(from).numero,
                                    "type": "interactive",
                                    "interactive": {
                                        "type": "list",
                                        "header": {
                                            "type": "text",
                                            "text": "Oficinas COOPIO XII"
                                        },
                                        "body": {
                                            "text": "Departamento del Magdalena\n"+
                                            "\n🏦Información general:"+
                                            "\nUbicación, datos de contacto y horarios de atención."
                                },
                                // "footer": {
                                //     "text": "🏪Información general de cada oficina:"
                                // },
                                        "action": {
                                            "button": "Nuestras Oficinas:",
                                            "sections": [
                                                {
                                                    "title": "Selecciona:",
                                                    "rows": [
                                                        {
                                                            "id": "1",
                                                            "title": "Santa Marta.",
                                                            "description": "Ver información oficina"
                                                        }                                                       
                                                          ,
                                                        {
                                                            "id": "2",
                                                            "title": "Salir.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "3",
                                                            "title": "Ir a departamentos.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "4",
                                                            "title": "volver al inicio.",
                                                            "description": ""
                                                        }
                                                        
                                                    ]
                                                },
                                             
                                            ]
                                        }
                                    }
                                }
                
                            )
                        }
                     

                    }


                
                    if (store.get(from).data[15].indexOf("Guajira") >= 0) {
                        var options1 = {
                            url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                            method: 'POST',
                            JSON: true,
                            headers: headers,
                            rejectUnauthorized: false,
                            body: JSON.stringify(
                                {
                                    "messaging_product": "whatsapp",
                                    "recipient_type": "individual",
                                    "to": store.get(from).numero,
                                    "type": "interactive",
                                    "interactive": {
                                        "type": "list",
                                        "header": {
                                            "type": "text",
                                            "text": "Oficinas COOPIO XII"
                                        },
                                        "body": {
                                            "text": "Departamento de la Guajira\n"+
                                            "\n🏦Información general:"+
                                            "\nUbicación, datos de contacto y horarios de atención."
                                        },
                                        // "footer": {
                                        //     "text": "🏪Información general de cada oficina:"
                                        // },
                                        "action": {
                                            "button": "Nuestras Oficinas:",
                                            "sections": [
                                                {
                                                    "title": "Selecciona:",
                                                    "rows": [
                                                        {
                                                            "id": "1",
                                                            "title": "Fonseca.",
                                                            "description": "Ver información oficina"
                                                        },
                                                        {
                                                            "id": "2",
                                                            "title": "Punto A. Riohacha.",
                                                            "description": "Ver información oficina"
                                                        }     

                                                          ,
                                                        {
                                                            "id": "3",
                                                            "title": "Salir.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "4",
                                                            "title": "Ir a departamentos.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "5",
                                                            "title": "volver al inicio.",
                                                            "description": ""
                                                        }                                                        
                                                    ]
                                                },                                             
                                            ]
                                        }
                                    }
                                }                
                            )
                        }                   
                    }


                    if (store.get(from).data[15].indexOf("Atlántico") >= 0) {
                        var options1 = {
                            url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                            method: 'POST',
                            JSON: true,
                            headers: headers,
                            rejectUnauthorized: false,
                            body: JSON.stringify(
                                {
                                    "messaging_product": "whatsapp",
                                    "recipient_type": "individual",
                                    "to": store.get(from).numero,
                                    "type": "interactive",
                                    "interactive": {
                                        "type": "list",
                                        "header": {
                                            "type": "text",
                                            "text": "Oficinas COOPIO XII"
                                        },
                                        "body": {
                                            "text": "Departamento del Atlántico\n"+
                                            "\n🏦Información general:"+
                                            "\nUbicación, datos de contacto y horarios de atención."
                                        },
                                        // "footer": {
                                        //     "text": "🏪Información general de cada oficina:"
                                        // },
                                        "action": {
                                            "button": "Nuestras Oficinas:",
                                            "sections": [
                                                {
                                                    "title": "Selecciona:",
                                                    "rows": [
                                                        {
                                                            "id": "1",
                                                            "title": "Sabanalarga.",
                                                            "description": "Ver información oficina"
                                                        }  
                                                          ,
                                                        {
                                                            "id": "2",
                                                            "title": "Salir.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "3",
                                                            "title": "Ir a departamentos.",
                                                            "description": ""
                                                        }
                                                        ,
                                                        {
                                                            "id": "4",
                                                            "title": "volver al inicio.",
                                                            "description": ""
                                                        }                                                        
                                                    ]
                                                },                                             
                                            ]
                                        }
                                    }
                                }                
                            )
                        }                     
                    }

                       
                  

                        request(options1, function (error, response, body) {
                            var prueba = body;
                        });

                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            entraoficina: 'S'
                        })
                        return

                    }
                    else {

                    if (store.get(from).intentosdepartamentos < 3) {
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 7,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            intentosdepartamentos: store.get(from).intentosdepartamentos + 1

                        })
                        peticioneswhatasapp(store.get(from).numero, "Debes realizar una selección en el listado Oficinas COOPIO XII, por favor intenta de nuevo...😢") 
                        
                        return
                    }
                    else {
                        peticioneswhatasapp(store.get(from).numero, "Realiza el proceso de nuevo. Excediste el límite de 3 intentos para realizar la selección de las oficinas") 
                        
                        store.remove(from)
                        return
                    }
                   }
                }


                if (store.get(from).paso == 8 && store.get(from).numero == from && store.get(from).opcion == '4') {
                 
                    if(store.get(from).data.length >= 16)
                    {
                 
                    if (store.get(from).data[15].indexOf("Cocorná.") >= 0) {
                    var message = "\n*Oficina Cocorná*" +
                            "\n*Dirección:* Carrera 21 # 21 - 03 Parque Principal" +
                            "\n*Cómo llegar?:* https://goo.gl/maps/NrNWpSt1p1yb6SkS9 📍" +
                            "\n*Teléfono:* 6045011737 ☎" +
                            "\n*E-mail:* cocorna@cpioxii.com.co 📧" +
                            "\n*Horario atención:* 🕗" +
                            "\nLunes, Jueves, Viernes y Sábado:" +
                            "\n8:00 a.m – 12:00 m | 2:00 p.m – 4:00 p.m." +
                            "\nMartes: 8:00 a.m – 1:00 p.m." +
                            "\nMiércoles: Cerrado" +
                            "\nDomingo: 8:00 a.m – 2:00 p.m." +
                            "\n*Web:* https://bit.ly/3MNxGMS 🌎"
                            store.set(from, {
                                opcion: '4',
                                numero: store.get(from).numero,
                                paso: 8,
                                nit: 0,
                                hora: store.get(from).hora,
                                fecha: store.get(from).fecha,
                                numceluescribe: store.get(from).numceluescribe,
                                entraoficina: 'S',
                                data: store.get(from).data,
                            })
                    }

            
                    if (store.get(from).data[15].indexOf("Medellín.") >= 0) {
                  
                    var message = "\n*Oficina Medellín*" +
                        "\n*Dirección:* Calle 50 # 46-36 Piso 2, Ed. Furatena" +
                        "\n*Cómo llegar?:* https://goo.gl/maps/94XarCRYkfjLcS4A6 📍" +
                        "\n*Teléfono:* 6045011737 ☎" +
                        "\n*E-mail:* medellin@cpioxii.com.co 📧" +
                        "\n*Horario atención:* 🕗" +
                        "\nLunes a Viernes: 8:00 a.m. – 12:00 m. " +
                        "\nSábado: 9:00 a.m. – 12:00 m. | 1:00 p.m. – 4:00 p.m." +
                        "\nDomingo: Cerrado" +
                        "\n*Web*: https://bit.ly/3xtPcQm 🌎"
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            entraoficina: 'S',
                            data: store.get(from).data,
                        })

                              }


           if (store.get(from).data[15].indexOf("Punto A. Monterrey.") >= 0) {
                         var message =  "\n*Punto de atención Monterrey*" +
                        "\n*Dirección:* Carrera 48 # 10 - 45 local 2201, CC. Monterrey, Medellín" +
                        "\n*Cómo llegar?:* https://g.page/CCMonterrey?share 📍" +
                        "\n*Teléfono:* 6045011737 ☎" +
                        "\n*E-mail:* monterrey@cpioxii.com.co 📧" +
                        "\n*Horario atención:* 🕗" +
                        "\nLunes a Viernes: 8:30 a.m. – 12:00 m. | 1:00 p.m. – 5:00 p.m" +
                        "\nSábado: 9:00 a.m. – 12:00 m. | 1:00 p.m. – 4:00 p.m." +
                        "\nDomingo: Cerrado" +
                        "\n*Web*: https://bit.ly/3NQLGGV 🌎"
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            entraoficina: 'S',
                            data: store.get(from).data,
                        })
                     }


                    if (store.get(from).data[15].indexOf("Rionegro.") >= 0) {               
                      var message = "\n*Oficina Rionegro*" +
                        "\n*Dirección:* Calle 49 # 50 - 105 Local 201, Parque Principal, Rionegro" +
                        "\n*Cómo llegar?:* https://goo.gl/maps/ZCuUZ9UxjcyZ4RnM8 📍" +
                        "\n*Teléfono:* 6045011737 ☎" +
                        "\n*E-mail:* rionegro@cpioxii.com.co 📧" +
                        "\n*Horario atención:* 🕗" +
                        "\nLunes a Viernes: 8:00 a.m. – 12:00 m. | 1:30 p.m. | 5:00 p.m." +
                        "\nSábado: 9:00 a.m. – 12:00 m." +
                        "\nDomingo: Cerrado" +
                        "\n*Web*: https://bit.ly/39lGV9n 🌎"   
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            entraoficina: 'S',
                            data: store.get(from).data,
                        })              
                    }

                if (store.get(from).data[15].indexOf("Cartagena.") >= 0) {
                        var message = "\n*Oficina Cartagena*" +
                        "\n*Dirección:* Carrera 27 # 30 - 46 Barrio la Quinta" +
                        "\n*Cómo llegar?:* https://goo.gl/maps/sUnxuY89Jo4xnUk28 📍" +
                        "\n*Teléfono:* 6045011737 ☎" +
                        "\n*E-mail:* cartagena@cpioxii.com.co 📧" +
                        "\n*Horario atención:* 🕗" +
                        "\nLunes a Viernes: 8:00 a.m. – 12:00 m. | 2:00 p.m – 4:00 p.m." +
                        "\nSábado: 9:00 a.m. – 12:00 m." +
                        "\nDomingo: Cerrado" +
                        "\n*Web*: https://bit.ly/3HArGWR 🌎"
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            entraoficina: 'S',
                            data: store.get(from).data,
                        })
                  
                }
                if (store.get(from).data[15].indexOf("Bogotá Kennedy.") >= 0) {
                    var message = "\n*Oficina Bogotá Kennedy*" +
                        "\n*Dirección:* Calle 36 Sur # 73 D - 52, Barrio Kennedy" +
                        "\n*Cómo llegar?:* https://goo.gl/maps/psQhWR7CWmGUxdsu7 📍" +
                        "\n*Teléfono:* 6045011737 ☎" +
                        "\n*E-mail:* bogota@cpioxii.com.co 📧" +
                        "\n*Horario atención:* 🕗" +
                        "\nLunes a Viernes: Jornada continua 9:00 a.m. – 4:00 p.m." +
                        "\nSábado: 9:00 a.m. – 12:00 m." +
                        "\nDomingo: Cerrado" +
                        "\n*Web*: https://bit.ly/3zFsTKi 🌎"
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            entraoficina: 'S',
                            data: store.get(from).data,
                        })
                 
                }

                if (store.get(from).data[15].indexOf("Bogotá Centro.") >= 0) {
                        var message = "\n*Punto de atención Bogotá Centro*" +
                        "\n*Dirección:* Calle 13 # 15 - 65, centro comercial NODO, local 1-15" +
                        "\n*Cómo llegar?:* https://goo.gl/maps/wVLGjY95i5b8wXEY6 📍" +
                        "\n*Teléfono:* 6045011737 ☎" +
                        "\n*E-mail:* bogota@cpioxii.com.co 📧" +
                        "\n*Horario atención:* 🕗" +
                        "\nLunes a Viernes: Jornada continua 9:00 a.m. – 4:00 p.m." +
                        "\nSábado: 9:00 a.m. – 12:00 m." +
                        "\nDomingo: Cerrado" +
                        "\n*Web*: http://bit.ly/3IFEYUg 🌎"
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            entraoficina: 'S',
                            data: store.get(from).data,
                        })
                    
                }
                
                if (store.get(from).data[15].indexOf("San Francisco.") >= 0) {               
                    var message = "\n*Oficina San Francisco*" +
                      "\n*Dirección:* Calle 10 # 10 - 05, Parque Principal, San Francisco." +
                      "\n*Cómo llegar?:* https://goo.gl/maps/RrLTAKLiej62KiDB6 📍" +
                      "\n*Teléfono:* 6045011737 ☎" +
                      "\n*E-mail:* sanfrancisco@cpioxii.com.co 📧" +
                      "\n*Horario atención:* 🕗" +
                      "\nLunes a Viernes: 8:00 a.m. – 12:00 m. | 2:00 p.m. | 4:00 p.m." +
                      "\nSábado: 9:00 a.m. – 12:00 m." +
                      "\nDomingo: Cerrado" +
                      "\n*Web*: https://bit.ly/44akM5w 🌎"   
                      store.set(from, {
                          opcion: '4',
                          numero: store.get(from).numero,
                          paso: 8,
                          nit: 0,
                          hora: store.get(from).hora,
                          fecha: store.get(from).fecha,
                          numceluescribe: store.get(from).numceluescribe,
                          entraoficina: 'S',
                          data: store.get(from).data,
                      })              
                }

                if (store.get(from).data[15].indexOf("Sincelejo.") >= 0) {
                    var message = "\n*Oficina Sincelejo*" +
                        "\n*Dirección:* Carrera 25 # 22 - 65, Avenida Las Peñitas" +
                        "\n*Cómo llegar?:* https://goo.gl/maps/CpE4iKq4ua8HZVdz6 📍" +
                        "\n*Teléfono:* 6045011737 ☎" +
                        "\n*E-mail:* sincelejo@cpioxii.com.co 📧" +
                        "\n*Horario atención:* 🕗" +
                        "\nLunes a Viernes: 8:00 a.m. – 1:00 p.m. | 2:00 p.m - 4:00 p.m." +
                        "\nSábado: 9:00 a.m. – 12:00 m." +
                        "\nDomingo: Cerrado" +
                        "\n*Web*: https://bit.ly/3Ocyrjt 🌎"
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            entraoficina: 'S',
                            data: store.get(from).data,
                        })                 
                }


                if (store.get(from).data[15].indexOf("Santa Marta.") >= 0) {              
                    var message = "\n*Oficina Santa Marta*" +
                        "\n*Dirección:* Calle 23 # 6 -18 C.C. Plazuela 23, Local 9" +
                        "\n*Cómo llegar?:* https://goo.gl/maps/MKnrexywty3SepS78 📍" +
                        "\n*Teléfono:* 6045011737 ☎" +
                        "\n*E-mail:* santamarta@cpioxii.com.co 📧" +
                        "\n*Horario atención:* 🕗" +
                        "\nLunes a Viernes: 8:00 a.m. – 12:00 m. | 2:00 p.m – 5:00 p.m" +
                        "\nSábado: 9:00 a.m. – 12:00 m." +
                        "\nDomingo: Cerrado" +
                        "\n*Web*: https://bit.ly/3tyLTX7 🌎"
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            entraoficina: 'S',
                            data: store.get(from).data,
                        })
                   
                }

                    if (store.get(from).data[15].indexOf("Fonseca.") >= 0) {
                    var message = "\n*Oficina Fonseca*" +
                        "\n*Dirección:* Calle 13 # 16 - 62, Barrio Centro" +
                        "\n*Cómo llegar?:* https://goo.gl/maps/cRN7qcMDhKNzZxQs9 📍" +
                        "\n*Teléfono:* 6045011737 ☎" +
                        "\n*E-mail:* fonseca@cpioxii.com.co 📧" +
                        "\n*Horario atención:* 🕗" +
                        "\nLunes a Viernes: 8:00 a.m. – 12:00 m. | 2:00 p.m – 5:00 p.m" +
                        "\nSábado: 9:00 a.m. – 12:00 m." +
                        "\nDomingo: Cerrado" +
                        "\n*Web*: https://bit.ly/3zBh3kh 🌎"
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            entraoficina: 'S',
                            data: store.get(from).data,
                        })
                 
                }
                if (store.get(from).data[15].indexOf("Punto A. Riohacha.") >= 0) {
                    var message = "\n*Punto de atención Riohacha*" +
                        "\n*Dirección:* Calle 12 #6-6, pasaje comercial Victoria, local 13" +
                        "\n*Cómo llegar?:* https://goo.gl/maps/PsumwDB2whNzguMh6 📍" +
                        "\n*Teléfono:* 6045011737 ☎" +
                        "\n*E-mail:* fonseca@cpioxii.com.co 📧" +
                        "\n*Horario atención:* 🕗" +
                        "\nLunes a Viernes: 8:00 a.m. – 12:00 m. | 2:00 p.m – 5:00 p.m" +
                        "\nSábado: 9:00 a.m. – 12:00 m." +
                        "\nDomingo: Cerrado" +
                        "\n*Web*: http://bit.ly/3XrWekh 🌎"
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            entraoficina: 'S',
                            data: store.get(from).data,
                        })
                  

                }

                if (store.get(from).data[15].indexOf("Sabanalarga.") >= 0) {
                    var message = "\n*Oficina Sabanalarga*" +
                        "\n*Dirección:* Calle 22 # 16B - 83 local 101" +
                        "\n*Cómo llegar?:* https://goo.gl/maps/QNVDkFWMMdwv8uMQ7 📍" +
                        "\n*Teléfono:* 6045011737 ☎" +
                        "\n*E-mail:* sabanalarga@cpioxii.com.co 📧" +
                        "\n*Horario atención:* 🕗" +
                        "\nLunes a Viernes: 8:00 a.m. – 12:30 m. | 2:00 p.m – 4:30 p.m" +
                        "\nSábado: 9:00 a.m. – 12:00 m." +
                        "\nDomingo: Cerrado" +
                        "\n*Web*: https://bit.ly/3zDuGzK 🌎"     
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            entraoficina: 'S',
                            data: store.get(from).data,
                        })           

                }

             
                if (store.get(from).data[15].indexOf("Argelia.") >= 0) {
                    var message = "\n*Oficina Argelia*" +
                        "\n*Dirección:* Carrera 31 # 30 - 77, Parque Principal" +
                        "\n*Cómo llegar?:* https://goo.gl/maps/R69ADGMCJpZo2tPf8 📍" +
                        "\n*Teléfono:* 6045011737 ☎" +
                        "\n*E-mail:* argelia@cpioxii.com.co 📧" +
                        "\n*Horario atención:* 🕗" +
                        "\nLunes a Viernes: 8:00 a.m. – 12:00 m. | 2:00 p.m – 5:00 p.m" +
                        "\nSábado: 8:00 a.m. – 12:00 m." +
                        "\nDomingo: Cerrado" +
                        "\n*Web*: https://bit.ly/3zygSq9 🌎"
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            entraoficina: 'S',
                            data: store.get(from).data,
                        })
                    
                }


                var options1 = {
                    url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                    method: 'POST',
                    JSON: true,
                    headers: headers,
                    rejectUnauthorized: false,
                    body: JSON.stringify(
    
                        {
                            "messaging_product": "whatsapp",
                            "recipient_type": "individual",
                            "to": store.get(from).numero,
                            "type": "interactive",
                            "interactive": {
                                "type": "button",
                                "body": {
                                    "text": message
                                },
                                "action": {
                                    "buttons": [
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "1",
                                                "title": "Salir"
                                            }
                                        },
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "2",
                                                "title": "Ir a departamentos."
                                            }
                                        }
                                        ,
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "3",
                                                "title": "volver al inicio."
                                            }
                                        }
                                    ]
                                }
                            }
                        }
    
    
                    )
                }
                request(options1, function (error, response, body) {
                    var prueba = body;
                });
                  
                          }

                 if (store.get(from).entraoficina == 'N' || store.get(from).entraoficina == undefined) {
                    //  intentosoficina = intentosoficina + 1
                    if (store.get(from).intentosoficina <= 3) {
                        store.set(from, {
                            opcion: '4',
                            numero: store.get(from).numero,
                            paso: 8,
                            nit: 0,
                            hora: store.get(from).hora,
                            fecha: store.get(from).fecha,
                            numceluescribe: store.get(from).numceluescribe,
                            intentosoficina: store.get(from).intentosoficina + 1

                        })
                        peticioneswhatasapp(store.get(from).numero, "Debes realizar una selección en el listado Oficinas COOPIO XII, por favor intenta de nuevo...😢") 
                        
                        return
                    }
                    else {
                        peticioneswhatasapp(store.get(from).numero, "Realiza el proceso de nuevo. Excediste el límite de 3 intentos para realizar la selección de las oficinas") 
                        
                        store.remove(from)
                        return
                    }

                }


                 //   oficinas()
                }


                function oficinas() {

                    // var request = require('request');
                    // var headers = {
                    //     'User-Agent': 'Super Agent/0.0.1',
                    //     'Content-Type': 'application/json'
                    // }
                    var messageofi = "Selecciona el departamento..."

                    var options1 = {
                        url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
                        method: 'POST',
                        JSON: true,
                        headers: headers,
                        rejectUnauthorized: false,
                        body: JSON.stringify(
                            {
                                "messaging_product": "whatsapp",
                                "recipient_type": "individual",
                                "to": store.get(from).numero,
                                "type": "interactive",
                                "interactive": {
                                    "type": "list",
                                    "header": {
                                        "type": "text",
                                        "text": "Oficinas COOPIO XII"
                                    },
                                    "body": {
                                        "text": messageofi
                                    },
                                    // "footer": {
                                    //     "text": "*Información Oficinas:*🏪"
                                    // },
                                    "action": {
                                        "button": "Departamentos:",
                                        "sections": [
                                            {
                                                "title": "Selecciona:",
                                                "rows": [
                                                    {
                                                        "id": "1",
                                                        "title": "Antioquia.",
                                                        "description": "Selecciona el departamento"
                                                    },
                                                    {
                                                        "id": "2",
                                                        "title": "Bolivar.",
                                                        "description": "Selecciona el departamento"
                                                    }
                                                    ,
                                                    {
                                                        "id": "3",
                                                        "title": "Bogotá.",
                                                        "description": "Selecciona el departamento"
                                                    }
                                                    ,
                                                    {
                                                        "id": "4",
                                                        "title": "Sucre.",
                                                        "description": "Selecciona el departamento"
                                                    }
                                                    ,
                                                    {
                                                        "id": "5",
                                                        "title": "Magdalena.",
                                                        "description": "Selecciona el departamento"
                                                    }
                                                    ,
                                                    {
                                                        "id": "6",
                                                        "title": "Guajira.",
                                                        "description": "Selecciona el departamento"
                                                    }
                                                    ,
                                                    {
                                                        "id": "7",
                                                        "title": "Atlántico.",
                                                        "description": "Selecciona el departamento"
                                                    },
                                                    {
                                                        "id": "8",
                                                        "title": "Salir.",
                                                        "description": ""
                                                    }
                                                    ,
                                                    {
                                                        "id": "9",
                                                        "title": "volver al inicio.",
                                                        "description": ""
                                                    }                                                    
                                                ]
                                            },
                                         
                                        ]
                                    }
                                }
                            }
            
                        )
                    }
            
                    request(options1, function (error, response, body) {
                        var prueba = body;
                    });

                    
                  
                    store.set(from, {
                        opcion: '4',
                        numero: from,
                        paso: 7,
                        nit: 0,
                        hora: store.get(from).hora,
                        fecha: store.get(from).fecha,
                        numceluescribe: store.get(from).numceluescribe,
                        intentosoficina: 0,
                        intentosdepartamentos:0

                    })
                    return


                }


})





    res.json("entro")


})


function peticioneswhatasapp(numero, mensaje) {
    var request = require('request');
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json',
        'Authorization': env('META_TOKEN')
    }



    var options = {
        url: env('URL_META'),  // 'http://localhost:3021/send?message=' + message + '&to=' + number,
        method: 'POST',
        JSON: true,
        headers: headers,
        rejectUnauthorized: false,
        body: JSON.stringify({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": numero,
            "type": "text",
            "text": {
                "preview_url": false,
                "body": mensaje
            }
        })
    }
    request(options, function (error, response, body) {
        var prueba = body;
    });
}








function tiene_letras(texto) {
    var letras = "abcdefghyjklmnñopqrstuvwxyz,.!#$%‰&'()*+,-./:;<<=>>?@[\]^_`{|}~¡";
    texto = texto.toLowerCase();
    for (i = 0; i < texto.length; i++) {
        if (letras.indexOf(texto.charAt(i), 0) != -1) {
            return 1;
        }
    }
    return 0;
}
function convertLetterToNumber(str) {
    var out = 0, len = str.length;
    for (pos = 0; pos < len; pos++) {
        out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - pos - 1);
    }
    return out;
}
const createGuid = () => {


    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true);
}


function pf () {
var fs = require("fs");
var path = require("path");
var RSVP = require("rsvp");



        // Interesting Data Structure, but we can still use it.
        // This is your routine that gets run any time a header needs to be printed.

     
            rpt.newLine(1);
            rpt.fontBold()
     
            rpt.print("Certificado de retención en la fuente e información adicional", {
                align: "center",
                fontSize: 9,

            });
            rpt.newLine(2);

            //            rpt.print("Numero de documento: " + data["cedulasociado"], {
            //         align: "left"
            //    });   
            rpt.fontNormal()

        // Create a new Report Engine
        // pipeStream is predefined in this report to make it display in the browser
        var rpt = new Report(path.join(__dirname, "../../../temp/certificadosenlote/myreportRetencion.pdf"));

      

        rpt
            .margins(40)
            .header(header)
            .data(data)
            .footer()
   
        // Run the Report
        // displayReport is predefined to make it display in the browser
        rpt.render(function (err, reportName) {
            if (err) return reject(err);
            var stream = fs.createReadStream(reportName);
            resolve(stream);
        });

   
}



module.exports = router;

