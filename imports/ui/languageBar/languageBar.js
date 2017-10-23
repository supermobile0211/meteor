/********** Template Helpers **********/
Template.languageBar.helpers({
    Languages: allLanguages,
    sourceLanguage: function(doc){
        return doc.isoCode == Session.get('sourceLang');
    }
});
