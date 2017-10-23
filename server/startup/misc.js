import { Meteor } from 'meteor/meteor';
import schedule from 'node-schedule';


Meteor.startup(function() {


    //delete orders which not completed automatically after 1/2 hour.
    schedule.scheduleJob('00 00 00 1-31 * *', Meteor.bindEnvironment(function () {
        let currentTime = new Date(),
            updatedTime = new Date(currentTime.setHours(currentTime.getHours() - 12));
        Orders.remove({

            displayed: false,
            createdAt: {$lte: updatedTime}

        })
    }));

    //update order automatically after 1/2 hour.
    schedule.scheduleJob('*/30 * * * *', Meteor.bindEnvironment(function () {
        let currentTime = new Date(),
            updatedTime = new Date(currentTime.setHours(currentTime.getHours() - 12));
        Orders.update({

            responded: false,
            status: {$ne: 'Cancelled'},
            createdAt: {$lte: updatedTime}

        }, {

            $set: { status: 'Cancelled' },
            $push: {
                history: {
                    $each: [{
                        history: {
                            status: 'Cancelled',
                            updatedAt: new Date(),
                            updatedBy: 'System'
                        }
                    }],
                    $position: 0
                }
            }
        }, {
            multi: true
        })

    }));

    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('resetpassword/' + token);
    };

    //set Environment for Email Server
    process.env.MAIL_URL = 'smtp://AKIAJ66Z2FG5LX66NSDQ:' + encodeURIComponent('An/F1hJcbEAtDY9rpnASQkK42Om9mZqycyU88E9r6sTU') + '@email-smtp.eu-west-1.amazonaws.com:465';
    Accounts.emailTemplates.from = "Market_Place <marketsol123@gmail.com>";

});

