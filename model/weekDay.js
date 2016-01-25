'use strict';

function WeekDay(date) {
    this.date = date;
    this.key = this.getKey();
    this.event = this.getEvents();
}

WeekDay.prototype = {
    constructor: WeekDay,
    getKey: function () {
        return this.date.getMonth() + 1 + "." + this.date.getDate() + "." + this.date.getFullYear();
    },
    getEvents: function () {
        var eventsObjects = [];
        var events = JSON.parse(localStorage.getItem(this.key));

        if(events) {
            for (var i = 0; i < events.length; i++) {
                var eventObj = new Event(this.date, events[i]);
                eventsObjects.push(eventObj);
            }

            return eventsObjects;
        }
    }
};
