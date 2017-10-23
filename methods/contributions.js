Meteor.methods({
    //product contributions
    addContributions : function( id, contributionId ){
        check(id, String);
        check(contributionId, String);
        var update = {
            $push:{
                contributions: contributionId
            }
        };
        Products.update({_id: id}, update)
    },

    addNewContribution: ( params ) => {
        if (!Meteor.userId()) {
            throw Meteor.Error(403, 'Access denied');
        }
        check(params, {
            product: String,
            translation: [Object],
            type: String,
            user:String,
            language:String,
            status: Match.Optional(Match.OneOf(String, Boolean)),
            skills: Match.Optional([Object]),
            category: [String],
            images: Match.Optional(Array),
            features: Match.Optional([Object]),
            featuresIndexes: Match.Optional([Object]),
            attributes: Match.Optional(Object),
            defaultCategory : Match.Optional(String)
            //TODO:inheritedCommission
            //inheritedCommission : Match.Optional(String)
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
        Contributions.insert(params);
    }
});