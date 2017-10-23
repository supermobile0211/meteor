import Future from 'fibers/future';
Meteor.startup(function () {
    if(Meteor.isServer) {
        Products._ensureIndex(
            {
                'translation.name': 'text',
                'translation.description': 'text'
            },
            {
                weights: {
                    'translation.name': 1,
                    'translation.description': 5
                }
            }
        );
    }

    //adding get indexes in prototype on all collections
    if (Meteor.isServer) {
        //var Future = Npm.require('fibers/future');
        Mongo.Collection.prototype.getIndexes = function () {
            var raw = this.rawCollection();
            var future = new Future();

            raw.indexes(function (err, indexes) {
                if (err) {
                    future.throw(err);
                }

                future.return(indexes);
            });

            return future.wait();
        };
    }
});