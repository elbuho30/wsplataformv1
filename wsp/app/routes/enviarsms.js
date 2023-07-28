module.exports = {
    enviarsms: enviarsms   
  }

function enviarsms(IDasociado, MensajeSMMV) {

    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
        // 'account': '10012129',
        // 'apikey': '9p7CFMGeeuMA9BekTuUtwiktl27wWu',
        // 'token': 'e0d14b7862504729bd0c92a87b6dad4a'
    }

   // crm.cpioxii.com.co/api/sms?api_key=FFBCD56AD7F61C9C4C2DBED433CBF
var apykey = process.env.API_KEY || 'FFBCD56AD7F61C9C4C2DBED433CBF'

//https://cpioxii.co/api/sms?api_key=FFBCD56AD7F61C9C4C2DBED433CBF
    var request = require('request');
    var optionsnotificacion = {
        url: 'https://cpioxii.co/api/sms?api_key= ' + apykey     ,
        method: 'POST',
        jar: true,
        headers: headers,
        rejectUnauthorized:false,
        body: JSON.stringify( {
            "to": IDasociado, // ID del asociado
            "text": MensajeSMMV, // Mensaje de texto
            "by": 181, // ID Usuario del BOT
            "view": "Bot Wsp" // Vista de donde se mandó
        })
    }


        request(optionsnotificacion, function (error, response, body) {
            console.log(body)
            console.log(MensajeSMMV)

        })



}















// module.exports = {
//     enviarsms: enviarsms   
//   }

// function enviarsms(celular, MensajeSMMV,entidad) {
//     var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//     var xhr = new XMLHttpRequest();
//     xhr.withCredentials = true;
 
//     // https://api.hablame.co/sms/envio/?cliente=10012129&api=9p7CFMGeeuMA9BekTuUtwiktl27wWu&numero=3195274902&&sms=PRUEBA&&referencia=e0d14b7862504729bd0c92a87b6dad4a


//     var cadenaMensaje =
//         "https://api101.hablame.co/api/sms/v2.1/send/?account=10012129&apiKey=9p7CFMGeeuMA9BekTuUtwiktl27wWu&token=e0d14b7862504729bd0c92a87b6dad4a&toNumber=" +
//         celular +
//         "&sms=" +
//         MensajeSMMV 
 

//     var respuesta = "";
//      load(cadenaMensaje);
//    // log("ya se hizo");
//     function load(url) {
//         var xhr = new XMLHttpRequest();

//         xhr.onreadystatechange = function() {
//             if (xhr.readyState === 4) {
//                 respuesta = xhr.responseText;
//              //   log(respuesta,entidad);
//             }
//         };
//         try {
//             xhr.open("POST", cadenaMensaje);
//             xhr.send("");
//         } catch (e) {
//            return "99"
//         }
//     }


//     function log(respuesta,entidad) {
      
//     var sql = require("../model/mssql.js")
//     // var configuracion = require("../routes/entidadesconfiguracion.js")
//     var config = require("../../config.json");
//     // var   config = configuracion.entidadesconfiguracion(entidad)
    
//          sql.connect(config).then(function (model) {
//         var Current_Date = new Date().toDateString();
//         var fecha = Date.now();
//         var insert =
//             "insert into tbllogenviosms(celularenviado,mensajeenviado,respuestaws,entidad ) values ( '" +
//             celular +
//             "','" +
//             MensajeSMMV +
//             "','" +
//             respuesta +
//             "','" +
//             entidad +
//             "')";

//         model
//             .consulta("", insert)
//             .then(function(recordsets) {
//             return "00"
//             })
//             .catch(function (err) {
//                 console.log(err) 
//                 return "99"          
//             });
//         });
//     }


// }