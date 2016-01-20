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
        /*if (localStorage.getItem(this.key) !== null) {
            return JSON.parse(localStorage.getItem(this.key));
        } else return undefined;*/
        var events = [];
        var eventsObjects = [];

        /*if (typeof this.date === 'string' || this.date instanceof String) {
            events = JSON.parse(localStorage.getItem(this.date));
        } else {*/
            var key = this.date.getMonth() + 1 + "." + this.date.getDate() + "." + this.date.getFullYear();
            //events = JSON.parse(localStorage.getItem(key));
            events = JSON.parse(localStorage.getItem(this.key)); //JSON.stringify(localStorage[this.key]); //JSON.parse();
        //}

        try {
            for (var i = 0; i < events.length; i++) {
                //console.log(events[i].getStartCord());
                var eventObj = new Event(this.date, events[i]);
                eventsObjects.push(eventObj);
            }

            return eventsObjects;
        } catch (e) {
            //console.log(e);
            return undefined;
        }
    }
};




























