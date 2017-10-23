import '../../build/css/intlTelInput.css'
import '../../build/css/demo.css'
import '../../build/js/intlTelInput.js'
import '../../build/js/utils.js'

/********** global variable  **********/
var filter = {};

Template.phoneFormInput.onCreated(()=>{

});




Template.phoneFormInput.onRendered(function(){
    let _self = this;
    //Meteor.setTimeout(function(){
    //    _self.$("#phoneNumber").on("countrychange", function(e, countryData) {
    //        console.log("running")
    //        _self.$("#phoneNumber").val('')
    //    });
    //}, 2000);

    let countries = Countries.find().fetch();
    if(countries){
        countries = _.map(countries, 'isoCode');
    }
    var telInput = _self.$("#phoneNumber");
    // initialise plugin
    telInput.intlTelInput({
        utilsScript: '../../build/js/utils.js',
        autoPlaceholder: true,
        onlyCountries: countries
    });
});

Template.phoneFormInput.helpers({

    validNumber: function(){
        return Session.get('invalidNumber');
    },

    countries: (()=>{
        if( Session.get("PCountriesFilter") ){
            return Session.get("PCountriesFilter");
        }
        else{
            return Countries.find();
        }
    }),

    SelectedCountry: function () {
        return Countries.findOne({
            name: Session.get("PcurrentEditCountry") && Session.get("PcurrentEditCountry").replace('-', ' ') || 'France'
        });
    },

    //prefixed: function(){
    //    if( Session.get('currentAddress')){
    //        return Session.get('currentAddress').phoneNumber;
    //    }
    //    else{
    //        var pre =  Countries.findOne({
    //            name: Session.get("PcurrentEditCountry") && Session.get("PcurrentEditCountry").replace('-', ' ') || 'France'
    //        });
    //        pre && Session.set('phone', pre.name + '(' +pre.prefix + ')');
    //        return pre && pre.prefix
    //    }
    //}
    prefixed: function(){
        if( Session.get('currentAddress') && (! Session.get('PselectionUpdated'))){
            return Session.get('currentAddress').phoneNumber;
        }
        //else{
        //    var pre =  Countries.findOne({
        //        name: Session.get("PcurrentEditCountry") && Session.get("PcurrentEditCountry").replace('-', ' ') || 'France'
        //    });
        //    pre && Session.set('phone', '(' +pre.prefix + ')');
        //    return pre && pre.prefix
        //}
    }
});

Template.phoneFormInput.events({

    'keyup #countryName' : function( e, t ) {
        var name = e.target.value;
        if ( !name || name == '') {
            filter['name'] && delete filter['name'];
        }
        else {
            filter['name'] && delete filter['name'];
            filter['name'] = {$regex : name + " *", $options:"i"};
        }
        Session.set("PCountriesFilter", Countries.find(filter).fetch());
    },

    'keyup #prefixNo' : function( e, t ){
        e.preventDefault();
        var prefix = e.target.value;
        if ( !prefix || prefix == '') {
            filter['prefix'] && delete filter['prefix'];
        }
        else {
            filter['prefix'] && delete filter['prefix'];
            filter['prefix'] = {$regex : prefix + " *", $options:"i"};
        }
        Session.set("PCountriesFilter", Countries.find(filter).fetch());
    },

    'click #selectPrefix' : function( e, t ){
        e.preventDefault();
        Session.set('PselectionUpdated', true);
        Session.set("PcurrentEditCountry", this.flag);
    }
});