Template.footer.onRendered(function() {
    let _self = this;

    // FIXED FOOTER
    // Uncomment this if you want to have fixed footer or add 'fixed' class to footer element in html code
    // $('.footer').addClass('fixed');


    // Initialize fooTable
    _self.$('.footable').footable();
	



    // DatePicker
    _self.$('input[name="daterange"]').daterangepicker();



    // Tooltips demo
    _self.$("[data-toggle=tooltip]").tooltip();


	// Bind normal buttons
	$('.ladda-button').ladda('bind', {timeout: 2000});
	// Bind progress buttons and simulate loading progress
	Ladda.bind('.progress-demo .ladda-button', {
		callback:  (instance)=> {
		var progress = 0;
		var interval = setInterval( ()=> {
			progress = Math.min(progress + Math.random() * 0.1, 1);
			instance.setProgress(progress);
			
			if (progress === 1) {
			instance.stop();
			clearInterval(interval);
			}
		}, 200);
		}
	});


// COMMON ALERTS

    _self.$('.removeItem').click( ()=> {
        swal({
            title: "Are you sure?",
            text: "This item will be removed",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, remove it!",
            closeOnConfirm: true
        },  ()=> {
            swal("Removed!", "The item is now removed.", "success");
        });
    });


    _self.$('.dropdownFooter .title').click(()=> {
        _self.$(this).siblings('ul').toggleClass('show');
        _self.$(this).parents('.dropdownFooter').toggleClass('open');
    });


});

Template.footer.helpers({
    today: function(){
        return new Date();
    },
    Followed: function() {
        return Languages.find();
    },
    selectedLanguages: function(){
        return Languages.findOne({
            isoCode: Session.get("currentEditLang") || 'en'
        });
    },
    currencies: function(){
        return Currencies.find({
            status: true
        })
    }
});

Template.footer.events({
    'click #selectLanguage': function(e, t){
        e.preventDefault();
        Session.set("currentEditLang", this.isoCode);
    },
    'click #currentCurrency':function(e){
        e.preventDefault();
        console.log(this.isoCode);
        Session.set("currentCurrency", this.name);
    }
});