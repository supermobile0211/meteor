Meteor.startup(function () {
    Offers._ensureIndex(
        {
            location: '2d'
        }
    );
    Products._ensureIndex(
        {
            'translation.name': 'text',
            'translation.description': 'text'
        },
        {
            weights: {
                'translation.name': 5,
                'translation.description': 1
            }
        }
    );

    //adding get indexes in prototype on all collections
    var Future = Npm.require('fibers/future');
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
});