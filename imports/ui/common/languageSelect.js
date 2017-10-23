
/********** global variable  **********/
var filter = {};

/********** Template Rendered **********/
Template.languageSelect.onRendered(()=> {
});

/********** Template helpers **********/
Template.languageSelect.helpers({

    Languages: function(){
        if( Session.get("LanguageFilter") ){
            return Session.get("LanguageFilter");
        }
        else{
            return Languages.find(filter).fetch();
        }
    },

    SelectedLanguage: function () {
        return Languages.findOne({
            isoCode: Session.get("currentEditLang") || 'en'
        });
    }
});

/********** Template events **********/
Template.languageSelect.events({

    'keyup #languageName' : function( e, t ) {
        var name = e.target.value;
        if ( !name || name == '') {
            filter['name'] && delete filter['name'];
        }
        else {
            filter['name'] && delete filter['name'];
            filter['name'] = {$regex : name + " *", $options:"i"};
        }
        Session.set("LanguageFilter", Languages.find(filter).fetch());
    },

    'click #selectLang' : function( e, t ) {
        Session.set("currentEditLang", this.isoCode)
    }
});

