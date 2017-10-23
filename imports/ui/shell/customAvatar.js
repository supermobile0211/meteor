import { Template } from 'meteor/templating';

import './customAvatar.html'

Template.customAvatar.onRendered(()=> {
    Avatar.setOptions({
        generateCSS: false,
        fallbackType: "../../../public/img/default_avatar.jpg",
        defaultImageUrl: "../../../public/img/default_avatar.jpg"
    });
});