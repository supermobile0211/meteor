/********** global variable  **********/
var filter = {};

Template.countriesFormSelect.onCreated(()=> {

});

Template.countriesFormSelect.onRendered(()=> {
    Session.set('currentEditCountry', false);
    Session.set("CountriesFilter", false);
    Session.set('selectionUpdated', false)

});

Template.countriesFormSelect.helpers({
    countries: (()=>{
        if( Session.get("CountriesFilter") ){
            return Session.get("CountriesFilter");
        }
        else{
            return Countries.find();
        }
    }),

    SelectedCountry: function () {
        //if(Session.get('selectionUpdated') && Session.get("currentEditCountry")){
        //    return Countries.findOne({
        //        name: Session.get("currentEditCountry").replace('-', ' ') || 'France'
        //    });
        //}
         if( Session.get("currentEditCountry") ){
            return Countries.findOne({
                name: Session.get("currentEditCountry").replace('-', ' ') || 'France'
            });
        }
        else if( Session.get('currentAddress')){
            return Countries.findOne({
                name: Session.get('currentAddress').country.replace('-', ' ')
            });
        }
        return Countries.findOne({
            name: Session.get("currentEditCountry") || 'France'
        });
    }
});

Template.countriesFormSelect.events({
    'keyup #countryName' : function( e, t ) {
        var name = e.target.value;
        if ( !name || name == '') {
            filter['name'] && delete filter['name'];
        }
        else {
            filter['name'] && delete filter['name'];
            filter['name'] = {$regex : name + " *", $options:"i"};
        }
        Session.set("CountriesFilter", Countries.find(filter).fetch());
    },

    'click #selectCountry' : function( e, t ){
        e.preventDefault();
        Session.set('selectionUpdated', true);
        Session.set("currentEditCountry", this.flag.replace("-", ' '));
    }
});