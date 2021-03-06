(function () {
    'use strict';

    angular
        .module('storage.service', [])
        .factory('storageService', storageService);

    function storageService() {
        var service = {
            isItOverlapOtherOne: isOverlapOtherOnes,
            updateEvent: updateEvent,
            saveEvent: saveEvent,
            deleteEvent: deleteEvent,
            getSortedEventList: getSortedList,
            getIncomingEvents: getIncomingEvents
        };
        return service;

        /**
         *
         * @param eventList list of events where to check if the requested event overlaps with someone from this list
         * @param event that we wanna check
         * @returns {string}
         */
        function isOverlapOtherOnes(eventList, event) {
            var eventStartCord = event.from.hour * 60 + event.from.minutes;
            var eventEndCord = event.to.hour * 60 + event.to.minutes;

            for (var j = 0; j < eventList.length; j++) {
                var existingEvent = eventList[j];

                var existingEventStartCord = existingEvent.from.hour * 60 + existingEvent.from.minutes;
                var existingEventEndCord = existingEvent.to.hour * 60 + existingEvent.to.minutes;

                var isStartCordInExistEventArea = eventStartCord >= existingEventStartCord
                    && eventStartCord <= existingEventEndCord;
                var isEndCordInExistEventArea = eventEndCord >= existingEventStartCord
                    && eventEndCord <= existingEventEndCord;
                var isOverlapExistEvent = eventStartCord < existingEventStartCord
                    && eventEndCord > existingEventEndCord;
                var temp = eventStartCord <= existingEventStartCord
                    && (eventEndCord >= existingEventStartCord && eventEndCord <= existingEventEndCord);

                if (isStartCordInExistEventArea || isEndCordInExistEventArea ||
                    isOverlapExistEvent || temp) {
                    return "You already have " + "<strong>" + existingEvent.name + "</strong>"
                        + "event in this time area that starts at:" + existingEvent.from.hour
                        + "." + existingEvent.from.minutes + " and ends at:" + existingEvent.to.hour
                        + "." + existingEvent.to.minutes;
                }
            }
        }

        /**
         * Updates event
         *
         * @param key to local storage item
         * @param newEvent
         * @param index of event in local storage item that we want to update
         */
        function updateEvent(key, newEvent, index) {
            var eventArray = JSON.parse(localStorage.getItem(key));
            eventArray[index] = newEvent;
            localStorage.setItem(key, JSON.stringify(eventArray));
        }

        /**
         * saves event in local storage
         *
         * @param key to local storage is basically a date of the day where event will be created
         *        example of a key: "1.12.2015"
         * @param event
         */
        function saveEvent(key, event) {
            if (localStorage.getItem(key) === null) {
                var eventsArray = [];
                eventsArray.push(event);
                localStorage.setItem(key, JSON.stringify(eventsArray));
            } else {
                var taskArray = JSON.parse(localStorage.getItem(key));

                var overlap = isOverlapOtherOnes(taskArray, event);
                if (overlap) {
                    throw overlap;
                }

                taskArray.push(event);
                localStorage.setItem(key, JSON.stringify(taskArray));
            }
        }

        /**
         * deletes event from local storage by index
         *
         * @param key to local storage
         * @param index of event in local storage item to delete
         */
        function deleteEvent(key, index) {
            var eventArray = JSON.parse(localStorage.getItem(key));
            eventArray.splice(index, 1);
            localStorage.setItem(key, JSON.stringify(eventArray));
        }

        /**
         * @returns {Array} returns not sorted array of all events
         */
        function getAllEvents() {
            var eventList = [];
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                // check if current local storage item have a valid 'date-like' key
                // since only 'date-like' (11.2.2009 as example) local storage items can have events data
                if (isDate(key)) {
                    var events = JSON.parse(localStorage[key]);
                    for (var j = 0; j < events.length; j++) {
                        events[j].key = key;
                        eventList.push(events[j]);
                    }
                }
            }
            return eventList;
        }

        /**
         * @returns {{todayEvents: Array, others: Array, tomorrow: Array}} returns sorted array of event
         */
        function getSortedList() {
            var events = getAllEvents();

            var todayEvents = [];
            var others = [];
            var tomorrow = [];

            var today = new Date();
            var todayKey = today.getMonth() + 1 + "." + today.getDate() + "." + today.getFullYear();

            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                event.date = new Date(event.key);
                var eventDate = new Date(event.key);
                if (event.key == todayKey) {
                    todayEvents.push(event);
                } else if (eventDate.getDate() - today.getDate() == 1) {
                    tomorrow.push(event);
                } else {
                    others.push(event);
                }
            }

            var sortedEvents = {
                todayEvents: todayEvents,
                others: others,
                tomorrow: tomorrow
            };

            return sortedEvents;
        }

        /**
         * @returns {Array} of event that going to happend today or already happening in the current time
         * objects in returning array should have 'timeTo' or 'current' extra property
         * 'timeTo' returns the amount of time in minutes before this event starts
         * 'current' returns the amount of time in minutes that left to end of this event
         */
        function getIncomingEvents() {
            var eventsList = [];

            var today = new Date();
            var todayKey = today.getMonth() + 1 + "." + today.getDate() + "." + today.getFullYear();

            var events = JSON.parse(localStorage.getItem(todayKey));

            if (events) {
                var currentHour = today.getHours();
                var currentMinutes = today.getMinutes();

                for (var j = 0; j < events.length; j++) {
                    var event = events[j];

                    var fromHour = event.from.hour;
                    var fromMinutes = event.from.minutes;

                    var toHour = event.to.hour;
                    var toMinutes = event.to.minutes;

                    var isIncoming = (currentHour < fromHour) || (currentHour == fromHour && currentMinutes < fromMinutes);
                    var isCurrent = ((currentHour < toHour) || currentHour == toHour && currentMinutes < toMinutes);

                    if (isIncoming) {
                        event.timeTo = ((fromHour - currentHour) * 60) + fromMinutes - currentMinutes;
                        eventsList.push(event);
                    } else if (isCurrent) {
                        event.current = ((toHour - currentHour) * 60) + toMinutes - currentMinutes;
                        eventsList.unshift(event);
                    }
                }
            }
            return eventsList;
        }

        function isDate(str) {
            var params = str.split('.');
            var yyyy = parseInt(params[2], 10);
            var mm = parseInt(params[0], 10);
            var dd = parseInt(params[1], 10);
            var date = new Date(yyyy, mm - 1, dd);
            return mm === (date.getMonth() + 1) && dd === date.getDate() && yyyy === date.getFullYear();
        }
    }

})();
