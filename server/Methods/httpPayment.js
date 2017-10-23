var env = process.env;
import uuid from 'uuid';
import soap from 'soap';
import crypto from 'crypto';
import dateFormat from 'dateformat';

var config = {
    systemPay: {
        shopId:24937366,
        url:'https://paiement.systempay.fr/vads-ws/v5?wsdl',
        cert:'1018401849976287',
        mode:env != 'production' ? 'TEST' : 'PRODUCTION'
    }
};

Meteor.methods({
    computeSignature: (valueString) => {
        check(valueString, String);
        var allValues = `${valueString}+${config.systemPay.cert}`;
        //return the computed signature with SHA1
       return crypto.createHash('sha1').update(allValues, 'utf8').digest('hex');
    }
});