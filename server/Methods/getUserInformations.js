//var Future = Npm.require('fibers/future');
import Future from 'fibers/future';
Meteor.methods({
    getInformation: function(){
        var fut = new Future();
        var response = HTTP.call('GET', 'http://freegeoip.net/json/',{npmRequestOptions: { encoding: null }},function(err, response){
            if (err) {
                fut.return(null);
            }
            fut.return(response.data);
        });
        return fut.wait();
    }
});