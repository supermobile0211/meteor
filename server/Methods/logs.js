Meteor.methods({
    updateLogs: (transactionId, logDetails) =>{
        check(transactionId, String);
        check(logDetails, Object);

        logDetails.updatedAt = new Date();
        Logs.update({
            transactionId: transactionId
        }, {
            $push: {
                logDetails: logDetails
            }
        }, {
            multi: true
        })
    }
});