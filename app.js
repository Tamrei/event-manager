(function () {
    'use strict';

    angular
        .module('myApp', ['calendar.controller', 'calendar.service', 'storage.service', 'calendar.directive', /*'calendar.run',*/ 'calendar-modal.controller',
            'updateEvent-modal.controller', 'confirmDelete-modal.controller', 'eventList-modal.controller',
            'ui.router', 'ui.bootstrap', "ngAnimate", 'anim-in-out', 'validateTime.directive', 'time-pointer.directive'])

        .config(function ($stateProvider) {
            var template =
                '<row>'
                + '<div class="col-md-1 day-bar" ng-repeat="weekDay in week" ng-click="open(weekDay.date)"'
                + 'ng-class="{today: weekDay.today,'
                + 'dayFromOtherYear : weekDay.date.getFullYear() != yearNumber}">'
                + '<h6 class="day-bar-header">{{weekDay.date | date:"dd MMMM / EEE"}}</h6>'
                //+ '<div ng-if="weekDay.today" style="text-align: center"> <h4></h4> </div>'
                + '<div ng-if="weekDay.today" class="time-pointer" time-pointer></div>'
                + '<div>'
                + '<p ng-repeat="event in weekDay.event track by $index"'
                + 'ng-class="{navigatedToEvent : selectedEventStartTime.hour == event.from.hour && selectedEventStartTime.minutes == event.from.minutes,'
                + 'activeEvent : weekDay.today && getTimePointerPos() >= event.getStartCord() && getTimePointerPos() <= event.getEndCord()}"'
                + 'draw-event>' //+ '{{timePointerPos}}' + ' | ' + '{{event.getEndCord()}}' + " | " + '{{event.getStartCord()}}'
                + '</p>'
                + '</div>'
                + '</div>'
                + '</row>';

            $stateProvider
                .state('weekRow', {
                    url: "/:week/:year",
                    template: template,
                    controller: function ($scope) {
                        // In your state controllers
                        $scope.$on('animIn', function ($event, element, speed) {
                        });
                    }
                });
        });

    // + '{{event.getStartCord()}}' + ' - ' + '{{event.getEndCord()}}'
})
();
