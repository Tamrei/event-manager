(function () {
    'use strict';

    angular
        .module('myApp', ['calendar.controller', 'calendar.service', 'storage.service', 'calendar.directive', 'calendar-modal.controller',
            'updateEvent-modal.controller', 'confirmDelete-modal.controller', 'eventList-modal.controller',
            'ui.router', 'ui.bootstrap', "ngAnimate", 'anim-in-out', 'timeLeft.directive', 'time-pointer.directive'])

        .config(function ($stateProvider) {
            var template =
                '<row>'
                + '<div class="col-md-1 day-bar" ng-repeat="weekDay in week" ng-click="open(weekDay)"'
                + 'ng-class="{today: weekDay.today,'
                + 'dayFromOtherYear : weekDay.date.getFullYear() != yearNumber}">'
                + '<h6 class="day-bar-header">{{weekDay.date | date:"dd MMMM / EEE"}}</h6>'
                + '<div ng-if="weekDay.today" class="time-pointer" time-pointer></div>'
                + '<div>'
                + '<p ng-repeat="event in weekDay.event track by $index"'
                + 'ng-class="{navigatedToEvent : selectedEventStartTime.hour == event.from.hour && selectedEventStartTime.minutes == event.from.minutes,'
                + 'activeEvent : weekDay.today && getTimePointerPos() >= event.getStartCord() && getTimePointerPos() <= event.getEndCord()}"'
                + 'draw-event>'
                + '</p>'
                + '</div>'
                + '</div>'
                + '</row>';

            $stateProvider
                .state('weekRow', {
                    url: "/:week/:year",
                    template: template,
                    controller: function ($scope) {
                    }
                });
        });
})
();
