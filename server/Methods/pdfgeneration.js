//Meteor.methods({
    //samplePDF: function(){
    //    var pdfStream = wkhtmltopdf(Template.test, options);
    //    console.log(pdfStream);
    //    return pdfStream
    //}

    //samplePDF: function(){
    //    var doc = new PDFDocument({size: 'A4', margin: 50});
    //    //var imageBase64 = Products.findOne().images[0];
    //    //var imageBuffer2 = new Buffer(imageBase64.replace('data:image/png;base64,','') || '', 'base64');
    //    //doc.image(imageBuffer2, 10, 10, {height: 75});
    //    doc.fontSize(12);
    //    doc.text('PDFKit is simple', 10, 30, {align: 'center', width: 200});
    //    // Save it on myApp/public/pdf folder (or any place) with the Fibered sync methode:
    //    //doc.writeSync(process.env.PWD + '/public/pdf/PDFKitExample.pdf');
    //    console.log(doc)
    //    return doc;
    //    //doc.writeSync("../../../../" +process.env.PWD +'PDFKitExample.pdf');
    //}
    //samplePDF: function(){
    //    Blaze.saveAsPDF(Template.test, {
    //        filename: "report.pdf", // optional, default is "document.pdf"
    //        //data: myData, // optional, render the template with this data context
    //        x: 0, // optional, left starting position on resulting PDF, default is 4 units
    //        y: 0, // optional, top starting position on resulting PDF, default is 4 units
    //        orientation: "landscape", // optional, "landscape" or "portrait" (default)
    //        unit: "in", // optional, unit for coordinates, one of "pt", "mm" (default), "cm", or "in"
    //        format: "letter" // optional, see Page Formats, default is "a4"
    //    });
    //}
//});