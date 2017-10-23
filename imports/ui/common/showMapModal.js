Template.showMapModal.onCreated(()=> {

    GoogleMaps.ready('ModalDetails', (map)=> {
        // Add a marker to the map once it's ready
        var marker = new google.maps.Marker({
            position: map.options.center,
            map: map.instance
        });
    });
});

Template.showMapModal.onRendered(function() {
    //TODO: find better solution for to show map in modal
    $(this).on('shown.bs.modal', triggerResize);
});

Template.showMapModal.helpers({
    vendorPlace: ()=> {
        var id = currentOrder() && currentOrder().vendorId;
        return Meteor.users.findOne({_id: id});
    },

    selectedAddress: () => Session.get('currentAddress'),

    addressType: () =>  Session.get('addressType'),

    ModalDetails: ()=> {
        // Make sure the maps API has loaded
        let selectedAddress = Session.get('currentAddress');
        if( selectedAddress ){
            var coord = {
                lat: selectedAddress.location[1],
                lon: selectedAddress.location[0]
            }
        }

        if (GoogleMaps.loaded() && coord) {
            return {
                zoom: 5,
                scrollwheel: false,
                center: new google.maps.LatLng(coord.lat, coord.lon)
            };
        }
    }
});