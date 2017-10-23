Template.vendorDashboardTab.onCreated(()=> {

    defaults = {
        color             : '#ED5565'
        , secondaryColor    : '#dfdfdf'
        , jackColor         : '#fff'
        , jackSecondaryColor: null
        , className         : 'switchery'
        , disabled          : false
        , disabledOpacity   : 0.5
        , speed             : '0.1s'
        , size              : 'default'
    };

    var config = {
        '.chosen-select'           : {},
        '.chosen-select-deselect'  : {allow_single_deselect:true},
        '.chosen-select-no-single' : {disable_search_threshold:10},
        '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
        '.chosen-select-width'     : {width:"95%"}
    };
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }


    $('input[name="daterange"]').daterangepicker();

    // Initialize switchery
    var elem_2 = document.querySelector('.js-switch');
    var switchery_2 = new Switchery(elem_2);

});

Template.vendorDashboardTab.onRendered(function(){
    Session.set('location', false);
    this.autorun(function () {
        if (GoogleMaps.loaded()) {
            $("#operatingAddress").geocomplete().bind("geocode:result", function(e, result){
                if(result){
                    var location = {
                        lat: result.geometry.location.lat(),
                        lon: result.geometry.location.lng()
                    };
                    Session.set('location', location);
                }
            });
        }
    });

});

Template.vendorDashboardTab.helpers({
    mister: (gender)=>{
        return this.profile && this.profile.title == 'mr';
    },
    misses: (gender)=> {
        return this.profile && this.profile.title == 'mrs';
    }

});

Template.vendorDashboardTab.events({
    'click #next': function( e,t ) {
        e.preventDefault();
        var name = t.$('#name').val(),
            title = $("[name='gender']:checked").val(),
            firstName = t.$('#firstName').val(),
            position = t.$('option:selected').val(),
            company = t.$('#company_name').val(),
            business = t.$('#business').val(),
            account = t.$('#backAccount').val(),
            ibanNumber = t.$('#ibanNumber').val(),
            paypalEmail = t.$('#paypalEmail').val(),
            operatingAddress = t.$('#operatingAddress').val(),
            state = t.$('#state').val(),
            zipCode = t.$('#zipCode').val(),
            city = t.$('#city').val();
          var params = {
                name: name,
                title: title,
                firstName: firstName,
                position: position,
                company: company,
                business: business,
                account: account,
                ibanNumber: ibanNumber,
                paypalEmail: paypalEmail,
                operatingAddress: operatingAddress,
                state: state,
                zipCode: zipCode,
                city: city
            };
        if(Session.get('location')){
            params.location = Session.get('location');
        }
        Meteor.call('updateUser', params, function(err, res) {
            if (err) {
                swal("Error", err.message, "error");
            }
            else swal("Success", "User information updated", "success");
        });
    }
});