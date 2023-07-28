// create a document and pipe to a blob

PDFDocument = require('pdfkit');
var fs = require("fs");
var path = require("path");

module.exports = function () {

    var doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(path.join(__dirname, '../../output.pdf')));



    var header = "FONDO DE EMPLEADOS DE PROTECCION S.A. \n NIT. 811026616-1 \n HACE CONSTAR QUE:";




    var lorem = "Lorem ipsum dolor sit amet," +
        "consectetur adipiscing elit.Etiam in" +
        "suscipit purus.Vestibulum ante" +
        "ipsum primis in faucibus orci luctus" +
        "et ultrices posuere cubilia Curae;" +
        "Vivamus nec hendrerit felis.Morbi" +
        "aliquam facilisis risus eu lacinia.Sed" +
        "eu leo in turpis fringilla hendrerit.Ut" +
        "nec accumsan nisl.Suspendisse" +
        "rhoncus nisl posuere tortor tempus et" +
        "dapibus elit porta.Cras leo neque," +
        "elementum a rhoncus ut, vestibulum" +
        "non nibh.Phasellus pretium justo" +
        "turpis.Etiam vulputate, odio vitae" +
        "tincidunt ultricies, eros odio dapibus" +
        "nisi, ut tincidunt lacus arcu eu elit." +
        "Aenean velit erat, vehicula eget" +
        "lacinia ut, dignissim non tellus." +
        "Aliquam nec lacus mi, sed" +
        "vestibulum nunc.Suspendisse ";

    // draw some text
    doc.fontSize(25)
        .text('Here is some vector graphics...', 100, 80);

    doc.fontSize(25).text(header, {
        width: 410,
        align: 'center'
    });

    // some vector graphics
    doc.save()
        .moveTo(100, 150)
        .lineTo(100, 250)
        .lineTo(200, 250)
        .fill("#FF3300");

    doc.circle(280, 200, 50)
        .fill("#6600FF");

    // an SVG path
    doc.scale(0.6)
        .translate(470, 130)
        .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
        .fill('red', 'even-odd')
        .restore();

    // and some justified text wrapped into columns
    doc.text('And here is some wrapped text...', 100, 300)
        .font('Times-Roman', 13)
        .moveDown()
        .text(lorem, {
            width: 412,
            align: 'justify',
            indent: 30,
            columns: 2,
            height: 300,
            ellipsis: true
        });

    // end and display the document in the iframe to the right
    return doc;
};