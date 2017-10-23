Meteor.methods({
    updateSingleTranslation : function( collection, id, keyNames, values, lang ,index) {
        check(collection, String);
        check(id, String);
        check(keyNames, [String]);
        check(values, [String]);
        check(lang, String);
        check(index,Match.Optional(String));
        var selector = {
            _id: id,
            'translation.language': lang
        };
        /***** pre-defined Object *****/
        var updated = {
            $push:{}
        };
        var newObj = {language: lang};
        updated.$push.translation = newObj;
        var update = {$set: {}}, documentsEffected;
        for (var i = 0; i < keyNames.length; i++) {
            update.$set["translation.$." + keyNames[i]] = values[i];
            newObj[keyNames[i]] = values[i];
        }
        if( collection == "P"){
            documentsEffected = Products.update(selector, update);
            /***** add Object *****/
            if(documentsEffected == 0){
                Products.update({_id: id}, updated);
            }
        }
        else if( collection == "SP"){
            documentsEffected = SuggestedProducts.update(selector, update);
            /***** add Object *****/
            if(documentsEffected == 0){
                SuggestedProducts.update({_id: id}, updated);
            }
        }
    }
});