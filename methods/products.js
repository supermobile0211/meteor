//if features already exists
updatePreviousFeatures = function(obj, name, values, lang){
    var update = {$addToSet: {}, $set:{}};
    update.$set['translation.' + lang+ '.' + obj.index + '.name'] = name;
    update.$set['translation.' + lang+ '.' + obj.index + '.translatable'] = obj.translatable;
    update.$addToSet['translation.' + lang+ '.' + obj.index + '.values'] = {
        $each : values
    };
    Features.update({}, update);
};

Meteor.methods({
    addProduct: ( params ) => {
        if (!Meteor.userId()) {
            throw Meteor.Error(403, 'Access denied');
        }
        check(params, {
            _id: String,
            translation: [Object],
            type: String,
            status: Match.Optional(Match.OneOf(String, Boolean)),
            skills: Match.Optional([Object]),
            offersCount: Match.Optional(Number),
            avgOffer: Match.Optional(Number),
            bestOffer: Match.Optional(Number),
            commission: Match.Optional(String),
            gtin: Match.Optional(Array),
            published: Boolean,
            category: Match.Optional([String]),
            uin: Match.Optional(String),
            combinations: Match.Optional([Object]),
            images: Match.Optional(Array),
            features: Match.Optional([Object]),
            featuresIndexes: Match.Optional([Object]),
            attributes: Match.Optional(Object),
            source: Match.Optional(String),
            defaultCategory : Match.Optional(String),
            inheritedCommission : Match.Optional(String)
        });
        if ( params.skills ) {
            for ( var i = 0; i < params.skills.length; i++ ) {
                var updateSkills = {$addToSet: {}};
                updateSkills.$addToSet['translation.' + params.skills[i].language] = {
                    $each: params.skills[i].values
                };
                Skills.update({}, updateSkills)
            }
        }

        if( params.features && params.featuresIndexes ){
            var update = {$push: {}};
            var currentFeatures = Features.find({}).fetch()[0].translation;
            for ( var i = 0; i < params.features.length; i++ ){
                var lang = params.features[i].language;
                for ( var j = 0; j < params.features[i].values.length; j++ ){
                    if( ! isNaN( params.featuresIndexes[j].index ) ){
                        updatePreviousFeatures( params.featuresIndexes[j], params.features[i].values[j].name, params.features[i].values[j].values, lang);
                    }
                    else{
                        update.$push['translation.' + lang] = {};
                        update.$push['translation.' + lang] = {
                            name: params.features[i].values[j].name,
                            values: params.features[i].values[j].values,
                            translatable : params.featuresIndexes[j].translatable,
                            defaultInAll : false,
                            defaultIn : []
                        };
                        Features.update({}, update);
                        update = {$push:{}};
                    }
                }
            }
        }
        !params.category.length && (params.category = 0);
        params.user = Meteor.userId();
        params.status && (params.status = Boolean(params.status));
        SuggestedProducts.insert(params);
    },

    unsubscribeProduct: function(id) {
        check(id, String);
        Products.update({
            _id: id
        }, {
            $pull:{
                subscribers: Meteor.userId()
            }
        });
    },

    subscribed: function(id){
        check(id, String);
        Products.update({
            _id: id
        }, {
            $addToSet:{
                subscribers: Meteor.userId()
            }
        });
    },

    productCount: function(params){
        return Products.find(params).count();
    }

});