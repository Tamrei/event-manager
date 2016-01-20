(function () {
    'use strict';

    angular
        .module('calendar.directive', [])
        .directive('drawEvent', drawEvent);

    function drawEvent($compile) {

        function isTouchDevice() {
            return 'ontouchstart' in window        // works on most browsers
                || navigator.maxTouchPoints;       // works on IE10/11 and Surface
        }

        return {
            link: function (scope, element) {
                var widthOfATimePanel = 735;

                var fromHour = scope.event.from.hour;
                var toHour = scope.event.to.hour;

                var fromMinutes = scope.event.from.minutes / 2;
                var toMinutes = scope.event.to.minutes / 2;

                /* to (starts from here) */
                var startCord =  widthOfATimePanel - ((toHour * 30) + toMinutes);

                /* from (and go down) */ /* length from star */
                var endCord = ((toHour - fromHour) * 30) + (toMinutes - fromMinutes);

                var template;


                if (isTouchDevice()) {
                    template =
                        "<div class='eventText event-in-day-bar'"
                        + "ng-click='open(weekDay, event, $index)' style='height: "
                        + endCord + "px; top: " + startCord + "px; padding-bottom: 0'>"
                        + scope.event.name
                        + "</div>"
                        + "</div>";
                } else {
                    scope.dynamicPopover = {
                        content: scope.event,
                        templateUrl: 'myPopoverTemplate.html',
                        title: 'Title'
                    };

                    template =
                        "<div class='eventText event-in-day-bar'"
                        + "popover-placement='right' uib-popover-template='dynamicPopover.templateUrl' popover-title='"
                        + scope.event.name + "' popover-trigger='mouseenter'"
                        + "ng-click='open(weekDay, event, $index)' style='height: "
                        + endCord + "px; top: " + startCord + "px; padding-bottom: 0'>"
                        + scope.event.name
                        + "</div>"
                        + "</div>";
                }

                var compTemp = $compile(template);
                var content = compTemp(scope);
                element.append(content);
            }
        }
    }
})();
