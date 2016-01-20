'use strict';

function Event(key, eventForm) {
    this.day = new Date(key);
    this.name = eventForm.name;
    this.comment = eventForm.comment;
    /*this.fromhour = eventForm.from.hours;
    this.fromminutes = eventForm.from.minutes;
    this.tohour = eventForm.to.hours;
    this.tominutes = eventForm.to.minutes;*/
    this.from = eventForm.from;
    this.to = eventForm.to;
}

Event.prototype = {
    constructor: Event,
    getStartCord: function () {
        return this.from.hour * 30 + this.from.minutes / 2;
    },
    getEndCord: function () {
        return this.to.hour * 30 + this.to.minutes / 2;
    }
};












