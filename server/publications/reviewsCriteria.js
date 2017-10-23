
import { Meteor } from 'meteor/meteor';
import './../../collections/reviewsCriteria.js';

Meteor.publish( 'reviewsCriteria', () => ReviewsCriteria.find({}) );
