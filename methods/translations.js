
/********** update multiple Translation for Products **********/
multipleTranslation = function( tFlag, translation, params, name, description, skills, features, imagesCount, images, type, attributes ,fromEditProduct, t, combinationsUin, reference){
    if( translation ){
        var tempName, tempDescription, tempSkills, tempFeatures, tempAttributes, tempReference, populatedDescription;
        /***** for all languages *****/
        for ( var key in translation ){
            if( translation.hasOwnProperty( key )) {
                var result = translation[key];
                /***** separate the parts of translation i.e title, description etc. *****/
                var parts  = result.text.toString().split('<ohoo>');

                /***** check if the language already exists *****/
                var index = _.findIndex(params.translation, function(obj) {
                    return obj.language == key
                });

                /***** TFLAG == title and description exists *****/
                if( tFlag ){
                    tempName = parts[0];
                    tempDescription = parts[1];
                    tempSkills = parts[2];
                    tempFeatures = skills ? parts[3] : parts[2];
                    tempAttributes = (skills && features)? parts[4] : (skills || features) ? parts[3] : parts[2];
                    tempReference = (attributes && skills && features)? parts[5] : (skills && features || attributes && skills || features && attributes)? parts[4] : (attributes || skills || features) ? parts[3] : parts[2];
                    populatedDescription = populateImages( tempDescription, imagesCount, images );
                    if( index != -1) {
                        params.translation[index].name = tempName;
                        params.translation[index].description = populatedDescription
                    }
                    /*****  other wise add it *****/
                    else{
                        params.translation.push({
                            language: key,
                            name: tempName,
                            description: populatedDescription
                        })
                    }
                }
                /***** !TFLAG == title and description not *****/
                else{
                    tempSkills = skills ? parts[1]: {};
                    tempFeatures = skills ? parts[2] : parts[1];
                    tempAttributes =(skills && features)? parts[3] : (skills || features) ? parts[2] : parts[1];
                    tempReference = (attributes && skills && features)? parts[4] : (skills && features || attributes && skills || features && attributes)? parts[3] : (attributes || skills || features) ? parts[2] : parts[1];
                }
                if(reference){
                    var langIndex = _.findIndex(params.translation, function(obj) {
                        return obj.language == key;
                    });
                    if( langIndex != -1) {
                        params.translation[langIndex].reference = tempReference ? tempReference.trim().split(',') : '';
                    }
                    /*****  other wise add it *****/
                    else{
                        params.translation.push({
                            language: key,
                            reference: tempReference ? tempReference.trim().split(',') : ''
                        });
                    }
                }
                if( skills ){
                    /***** check if the language already exists *****/
                    var skillIndex = _.findIndex(params.skills, function(obj) {
                        return obj.language == key;
                    });
                    if( skillIndex != -1) {
                        params.skills[skillIndex].values = tempSkills ? tempSkills.split(',') : '';
                    }
                    /*****  other wise add it *****/
                    else{
                        params.skills.push({
                            language: key,
                            values: tempSkills ? tempSkills.split(',') : ''
                        })
                    }
                }
                if( features ){
                    tempFeatures = translateFeatures(tempFeatures, params.features[0]);
                    /***** check if the language already exists *****/
                    var featuresIndex = _.findIndex(params.features, function(obj) {
                        return obj.language == key;
                    });
                    if( featuresIndex != -1) {
                        var index;
                        //params.features[featuresIndex].values = tempFeatures;
                        tempFeatures.forEach(function (feature){
                            index = feature.index;
                            delete feature.index;
                            params.features[featuresIndex].values.splice(index, 0, feature);
                        })
                    }
                    /*****  other wise add it *****/
                    else{
                        for ( var i = 0; i < tempFeatures.length; i++ ){
                            delete tempFeatures[i].index
                        }
                        params.features.push({
                            language: key,
                            values: tempFeatures
                        });
                    }
                }
                if( attributes ){
                    tempAttributes ?
                        (tempAttributes = translateAttributes(tempAttributes)) :
                        tempAttributes = translateAttributes(translation[key].text.toString());
                    params.attributes[key] = tempAttributes;
                    if (fromEditProduct) {
                        if( params.combinations ){
                            //params.combinations[key] = checkCombinations(t , combinationsGenerator(t.data.uin, tempAttributes , false, combinationsUin), true, key)
                            params.combinations.push({
                                language: key,
                                values: checkCombinations(t , combinationsGenerator(t.data.uin, tempAttributes , false, combinationsUin), true, key)
                            })
                        }

                    }
                    else{
                        if ( params.combinations ){
                            params.combinations.push({
                                language: key,
                                values: combinationsGenerator(t, tempAttributes, false, combinationsUin)
                            })
                        }
                    }
                }
            }
        }
    }
};
