/**
 * Created by appBakerz - 05 on 21-Jan-17.
 */



/********** Template on Created  **********/
Template.vendorTransportEditCarrier.onCreated(function() {
    Session.set('step' , 1);
    Session.set('payload' , {});
});

/********** Template on Rendered  **********/
Template.vendorTransportEditCarrier.onRendered(function () {
    Session.set('carrierData', Carrier.findOne({_id : FlowRouter.current().params.id}));
    var carrierData = Session.get('carrierData');
    $('#carrierName').val(carrierData.name);
    $('#carrierTransitTime').val(carrierData.time);
    $('#carrierTrackingURL').val(carrierData.trackingUrl);
    Session.set('images',carrierData.images);
    Session.set('range',carrierData.ranges);
    $('#width').val(carrierData.packageWidth);
    $('#height').val(carrierData.packageHeight);
    $('#depth').val(carrierData.packageDepth);
    $('#weight').val(carrierData.packageWeight);
    $('.freeShipping').prop("checked",carrierData.freeShipping);
    let markAll = $('#markAll');
    carrierData.isAllMarked ? markAll.prop("checked", true) : markAll.prop("checked", false);
    if(carrierData.ranges){
        Meteor.setTimeout(function(){
            var increment = 0;
            carrierData.isAllMarked ? increment = 1 : increment = 0;
            for(var k=0;k<carrierData.ranges.length;k++){
                $('#max'+k).val(carrierData.ranges[k].max);
                $('#min'+k).val(carrierData.ranges[k].min);
                if(carrierData.isAllMarked){
                    $("[fieldid="+'mark'+k +"]").val(carrierData.ranges[k].allowedCountry[0].price);
                }
            }
            if(carrierData.ranges.length){
                for(var j=0;j<carrierData.ranges[0].allowedCountry.length - increment;j++){
                    for(var i=0; i<carrierData.ranges.length;i++){
                        var textBoxVal = carrierData.isAllMarked ? carrierData.ranges[i].allowedCountry[0].price :carrierData.ranges[i].allowedCountry[j].price;
                        let id = $('#'+ carrierData.ranges[i].allowedCountry[j+increment].countryId);
                        id.find('.singlebox').prop("checked", true);
                        id.find('#textBox'+j+'_'+i).val(textBoxVal);
                    }
                }
            }

        },500)
    }

});

/********** Template on Helpers  **********/
Template.vendorTransportEditCarrier.helpers({
    currentStep : function(tab ){
        return tab == Session.get('step')
    },

    classes : function(tab){
        var tabClasses;
        var currentTab = Session.get('step');
        switch(tab) {
            case 1:
                tabClasses =  (currentTab == 1) ? 'current' : 'success';
                break;
            case 2:
                tabClasses =  (currentTab == 1) ? 'disabled' : (currentTab == 2) ? 'current' : 'success' ;
                break;
            default:
                tabClasses =  (currentTab == 1 || currentTab == 2) ? 'disabled' :  'current'  ;
        }
        return tabClasses;
    }
});

Template.vendorTransportEditCarrier.events({
    'click #markAll' : function(e){
        if(e.target.checked){
            Session.set('markAll',false);
            Session.set('markAll',true);
        }
    },
    'click .singlebox' : function(){
        if(Session.get('markAll')){
            $('#markAll').attr('checked', false);
        }
    }
});



/********************* child template 1 ***************/

Template.carrierGeneralSettingsEdit.onRendered(function() {
    Session.set('imagesValid' , false);
    $('#general-step1').validate({
        rules: {
            carrierName: {
                required: true
            },
            transit: {
                required: true
            }
        },
        messages: {
            carrierName: {
                required: "Please enter Carrier name."
            },
            transit: {
                required: "Please enter transit time."
            }
        },
        invalidHandler: function(event, validator) {
            if(!Session.get('images').length){
                Session.set('imagesValid' , true);
            }
        },

        submitHandler: function(form) {
            if(Session.get('images').length){
                var $form = $(form),
                    payload = Session.get('payload');
                payload.name = $form.find('#carrierName').val();
                payload.time = $form.find('#carrierTransitTime').val();
                payload.status = $form.find('.updateStatus')[0].checked;
                payload.images = Session.get('images').map(function(obj){
                    return obj.url
                });
                payload.trackingUrl = $form.find('#carrierTrackingURL').val();
                Session.set('payload',payload);
                Session.set('imagesValid' , false);
                Session.set('step', Session.get('step') + 1);
            }
            else{
                Session.set('imagesValid' , true);
            }
        }
    });

});



Template.carrierShippingEdit.onRendered(function() {
    Session.set('range' , [1]);
    $('#general-step2').validate({
        rules: {
            range1: {
                required: true
            },
            range2: {
                required: true
            }
        },
        messages: {
            range1: {
                required: "Please fill this field."
            },
            transit: {
                required: "Please fill this field."
            }
        },
        submitHandler: function(form) {
            //form.submit();
            var $form = $(form);
            var $tbody= $(form).find('table tbody'),
                range = [];
            $tbody.find('tr').each(function(index) {
                var trSelf= this, flag = true,
                    check ;
                $(this).find('td').each(function(indexTd){
                    //range[indexTd - 2].allCoun
                    //    range[indexTd - 2].allowedAll = check
                    //};
                    if(indexTd){
                        var $this = $(this);
                        if($this.hasClass('min')){
                            if(!index){
                                range.push({min : Number($this.find('.form-control').val()), allowedCountry : []});
                            }
                        }
                        else if($this.hasClass('max')){
                            range[indexTd - 2].max = Number($this.find('.form-control').val());
                        }
                        else if($this.hasClass('check-status')){
                            check = $this.find('.checked').is(":checked");
                        }
                        else if($this.hasClass('price')){
                            if ( check ){
                                range[indexTd - 2].allowedCountry.push({
                                    countryId : $(trSelf).data('id'),
                                    price : $this.find('.form-control').val(),
                                    allowed : check
                                });
                            }
                        }
                    }
                });
            });

            var payload = Session.get('payload');
            payload.ranges = range;
            payload.freeShipping = $form.find('.freeShipping')[0].checked;
            Session.set('payload',payload );
            Session.set('step', Session.get('step') + 1);
        }
    });

});

Template.carrierShippingEdit.events({
    'click .remove-range': function(evt, temp){
        var range = Session.get('range');
        range.splice($(evt.currentTarget).data('id') , 1);
        Session.set('range' , range);
    },
    'change .rangeMax': function(e){
        var value = e.target.value;
        var index = $(e.currentTarget).data('max');
        var range = Session.get('range');
        range[index].max = value;
        Session.set('range', range);
    },
    'change .rangeMin': function(e){
        var value = e.target.value;
        var index = $(e.currentTarget).data('min');
        var range = Session.get('range');
        range[index].min = value;
        Session.set('range', range)
    },
    'click #add-range': function(evt, temp){
        var range = Session.get('range');
        range.push({allowedCountry :[],
            max:"",
            min:""});
        Session.set('range', range);
    },
    'click .removeRange': function(evt, temp){
        var range = Session.get('range');
        range.splice($(evt.currentTarget).data('id') , 1);
        Session.set('range' , range);
    },
    'click #previous-step1': function(evt, temp){
        Session.set('step', Session.get('step') - 1);
    },
    'change .allTextBoxes' : function(){
        Session.set('markAll',false);
        $('#markAll').prop("checked", false);
    },
    'change #allPrice' : function(){
        var tempMark = Session.get('markAll');
        Session.set('markAll',false);
        Session.set('markAll',tempMark);
    }
});

Template.carrierShippingEdit.helpers({
    countries: function(){
        return Countries.find({status : true}).fetch()
    },
    range: function(){
        return Session.get('range');
    },
    index: function(index){
        return index + 1;
    },
    ischecked : function(index){
        if(Session.get('markAll')){
            $('#singleCheckbox' + index).prop("checked", true);
        }
        else{
            return false;
        }
    },
    countryRange : function(parentIndex,index){
        if(Session.get('markAll')){
            $('#textBox'+ parentIndex + '_' + index).val($("[fieldid="+'mark'+index +"]").val());
        }
    }
});


Template.carrierSizeEdit.onRendered(function() {

});

Template.carrierSizeEdit.events({
    'click #finish': function(evt, temp){
        if(FlowRouter.current().params.id) {
            var $form = $(temp),
                payload = Session.get('payload');
            payload.packageWidth = Number(temp.$('#width').val());
            payload.packageHeight = Number(temp.$('#height').val());
            payload.packageDepth = Number(temp.$('#depth').val());
            payload.packageWeight = Number(temp.$('#weight').val());
            Carrier.find({}).fetch().length ? (payload.position = (Carrier.find({}).fetch()[Carrier.find({}).fetch().length - 1].position) + 1) : (payload.position = 1);
            Session.set('payload', payload);
            Meteor.call('editCarrier',Session.get('payload'), FlowRouter.current().params.id, function (err) {
                if (err) {
                    swal({
                        title: "Failed!",
                        text: err.message,
                        type: "error"
                    });
                    return;
                }
                swal("Published!", "Successfully carrier Updated.", "success");
                FlowRouter.go('vendorTransport')
            });
        }
    },
    'click #previous-step2': function(evt, temp){
        Session.set('step', Session.get('step') - 1);
    }
});
