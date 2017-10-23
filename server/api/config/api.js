import bodyParser from 'body-parser';

Picker.middleware( bodyParser.urlencoded({ extended: false }) );
Picker.middleware( bodyParser.json() );
Picker.route('/bankUrl', function(params, req, res, next) {
    let keys = req.body;
    let obj = {
        keys: keys
    };
    Meteor.call('justTest', obj, function(err, response){
        if(err){
            console.log(err);
            res.end("test err")
        }
        res.end('test response')
    });
});

Picker.route('/bankUrlKeys', function(params, req, res, next) {
    let tests = Test.find({}).fetch();
    res.end(JSON.stringify(tests))
});