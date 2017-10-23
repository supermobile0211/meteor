// Run this when the meteor app is started
Meteor.startup(()=> {
    GoogleMaps.load({
        v: '3',
        key: 'AIzaSyAFWNNji1j8iSjNhBOtqkjOVJZY7wB5pp4',
        libraries: ['places', 'map']  // also accepts an array if you need more than one
    });
    Meteor.subscribe('userData');
    Session.set('currentEditLang', 'en');
    Session.set('currentCurrency','Euro');
    Session.set('selectedCategories', []);
    Session.set('affiliateLinked', false);
    Session.set('affiliateId', false);
    ShareIt.configure({
        sites: {                // nested object for extra configurations
            'facebook': {
                'appId': 254954424878861	// use sharer.php when it's null, otherwise use share dialog
            },
            'twitter': {},
            'pinterest': {},
            'googleplus': {}
        },
        classes: "large btn", // string (default: 'large btn')
                              // The classes that will be placed on the sharing buttons, bootstrap by default.
        iconOnly: true,      // boolean (default: false)
                              // Don't put text on the sharing buttons
        applyColors: true,     // boolean (default: true)
        // apply classes to inherit each social networks background color
        faSize: '',            // font awesome size
        faClass: ''		  // font awesome classes like square
    });
});