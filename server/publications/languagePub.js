
import { Meteor } from 'meteor/meteor';
import './../../collections/languages.js';

Meteor.publish('languages', ()=> {
    return Languages.find({});
});
