import webshot from 'webshot';
import fs from 'fs';
import Future from 'fibers/future';
import {invoiceTemplate} from '../pdfTemplates/invoice'

Meteor.methods({
    generatePDF: function(order, user){

        let record, data, html_string, options, pdfData, invoiceHtml,
            fut = new Future(),
            fileName = "report.pdf";
            //invoiceHtml = Assets.getText('invoice1.html');

        webshot(invoiceTemplate(order, user), fileName, {siteType:'html'}, function(err) {
            fs.readFile(fileName, function (err, data) {
                if (err) {
                    return console.log(err);
                }

                fs.unlinkSync(fileName);
                fut.return(data);

            });
        });

        pdfData = fut.wait();
        return new Buffer(pdfData).toString('base64');

    }
});
