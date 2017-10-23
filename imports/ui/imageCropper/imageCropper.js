
/********** Template on Created  **********/
Template.imageCropper.onCreated(()=> {
    Session.set('images', []);
    Session.set('copper', true);
    Session.set('progressBar', false);
    Session.set('uploadingProgress', 0);
});
Template.imageCropper.onRendered(function() {
    var $image = this.$(".image-crop > img"),
        $inputImage = this.$("#inputImage");
    this.$($image).cropper({
        preview: ".img-preview",
        done: function(data) {
            // Output the result data for cropping image.
        }
    });
    if (window.FileReader) {
        Session.set('progressBar', true);
        $inputImage.change(function(e) {
            Session.set('copper', false);
            var fileReader = new FileReader(),
                files = e.target.files,
                file;
            if (!files.length) {
                return;
            }
            file = files[0];
            if (/^image\/\w+$/.test(file.type)) {
                fileReader.readAsDataURL(file);
                fileReader.onload = function () {
                    $inputImage.val("");
                    Session.set('currentBase64', this.result);
                    $image.cropper("reset", true).cropper("replace", this.result);
                };
            } else {
                $('#inputImage').val('');
                swal("Error", "Please choose an image file.", "error");

            }
        });
    } else {
        $inputImage.addClass("hide");
    }
});

/********** Template helpers **********/
Template.imageCropper.helpers({
    copper: function() {
        return Session.get('copper');
    },
    progress: function () {
        return Math.round(Session.get('uploadingProgress'));
    },
    productImages: function(){
        return Session.get('images')
    },
    progressBar: function() {
        return Session.get('progressBar');
    },
    progressCounter: function(count) {
        if(count == 100){
            return false
        }
    },
    imagesValid : function(){
        return !Session.get('images').length &&  Session.get('imagesValid');
    }
});

/********** Template Events **********/
Template.imageCropper.events({
    /************* Change Features Key ****************/

    /********** Upload Image **********/
    'click #uploadImage': function(event){
        event.preventDefault();
        uploadImage('Uploaded');
    },

    /********** Update Image **********/
    'click #editImage': function(event){
        event.preventDefault();
        uploadImage('Update');
    },

    /**********  Select Remove image **********/
    'click .removeImage': function(event){
        var images = Session.get('images');
        images.splice($(event.target).data('id') ,1);
        Session.set('images', images);
    },

    /********** Select edit  image **********/
    'click .editImage': function(event, t){
        var $image = t.$(".image-crop > img"),
            image  = Session.get('images').splice($(event.target).data('id') ,1);
        Session.set('editImage' , image);
        $image.cropper("reset", true).cropper("replace", image[0].base64);
    },

    'click #download' : function(event, template) {
        window.open(template.$(".image-crop > img").cropper("getDataURL"));

    },
    'click #zoomIn' : function(event, template) {
        template.$(".image-crop > img").cropper("zoom", 0.1);

    },
    'click #zoomOut' : function(event, template) {
        template.$(".image-crop > img").cropper("zoom", -0.1);

    },
    'click #rotateLeft' : function(event, template) {
        template.$(".image-crop > img").cropper("rotate", 45);

    },
    'click #rotateRight' : function(event, template) {
        template.$(".image-crop > img").cropper("rotate", -45);

    },
    'click #setDrag' : function(event, template) {
        template.$(".image-crop > img").cropper("setDragMode", "crop");

    },

    /************* Image crop as online url ****************/
    'click #downloadUrl': function(event, template){
        var url = template.$('#onlineImage').val();
        if(validUrl(url)){
            Meteor.call('getImage', url, function( err, base64 ){
                if( !base64){
                    swal("Error", 'Unable to get Image from given Url', "error");
                }
                Session.set('currentBase64', base64);
                template.$(".image-crop > img").cropper("reset", true).cropper("replace", base64);
                Session.set('copper', false);
            });
        }
        else{
            swal("Error", 'Please enter valid url', "error");
        }
    }
});


/********** Image Upload to server **********/
uploadImage = function (which, editor, callback){
    var existingimageName;
    Session.set('currentId', Meteor.userId());
    if ( Session.get('currentId') ) {
        var generateName = Session.get('currentId').split("").join("/") + '/' + Session.get('currentId') + Math.random().toPrecision(5),
            imageName = Session.get('imageFrom') == 'product' ? 'img/p/' + generateName + ".jpg" : 'img/c/' + generateName + ".jpg";
    }
    if( editor ){
        Image = which
    }
    else{
        Session.set('inProgress', true);
        //var generateName = Session.get('currentId') +'/'+ Session.get('currentId') + Math.random().toPrecision(5);

        var filesName = $("input#inputImage"),

            $image = $(".image-crop > img"),
            files = $image.cropper("getDataURL");
        if (filesName[0].files[0] != undefined){
            existingimageName = filesName[0].files[0].name;
        }
        /*********** global function dataURItoBlob***********/
        var Image = dataURItoBlob(files);
        //add fallback if not Generated from Create/Edit
        Image.name = imageName || existingimageName || 'testImage';
    }
    //IMPORTANT TODO: shifting privite keys to meteor config or environment variables
    AWS.config.update({
        accessKeyId: "AKIAIGJTZEZTQ6WJF2EA",
        secretAccessKey: "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",
        region: "eu-central-1"
    });
    var s3 = new AWS.S3({
        params: {
            Bucket: "marketplacedemomike",
            region: "eu-central-1"
        }
    });

    var params = {
        Key: Image.name,
        Body: Image,
        ContentType: 'image/jpeg',
        ACL: 'public-read'
    };

    events = s3.upload(params, function(error, downloadUrl){
        Session.set('inProgress', false);
        Session.set('uploadingProgress', 0);
        if(error){
            swal("Error", error, "error");
        }
        if (editor) {
            callback(null, downloadUrl.Location)
        }

        else{
            if(which == 'Uploaded'){
                Session.set('images' , Session.get('images').concat({url: downloadUrl.Location, base64 :  Session.get('currentBase64', this.result)}));
            }
            else{
                var editImage =  Session.get('editImage'),
                    images = Session.get('images'),
                    updateImage =  images.map(function(obj){
                        if(JSON.stringify(obj) === JSON.stringify(editImage[0])){
                            obj.url = downloadUrl.Location
                        }
                        return obj
                    });
                Session.set('editImage' , false);
                Session.set('images' , updateImage);
            }
            swal("Success", "Image " + which + "." , "success");
        }


    });
    events.on('httpUploadProgress', function(progress) {
        Session.set('uploadingProgress',(progress.loaded / progress.total * 100).toPrecision(2));
    });
    events.on('success', function(response) {
    });
};