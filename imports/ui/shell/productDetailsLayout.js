Template.productDetailsLayout.onCreated(() => {
    //check window width and set position according to width.
    if($( window ).width() < 992) Session.set('positionValue', 'static');
    else Session.set('positionValue', 'fixed');

    $(window).on('resize', function(){
        if($( window ).width() < 992) Session.set('positionValue', 'static');
        else Session.set('positionValue', 'fixed');
    });
});

Template.productDetailsLayout.helpers({
    modelOpen: function() {
        if(Session.get('modelOpen')) Session.set('positionValue', 'static');
        return `position: ${Session.get('positionValue')} !important`
    }
});