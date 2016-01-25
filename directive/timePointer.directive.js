(function () {
    'use strict';

    angular.module('time-pointer.directive', [])
        .directive('timePointer', function ($compile, $timeout, $rootScope) {
            return function (scope, element, attrs) {
                var timeoutId; // timeoutId, so that we can cancel the time updates
                var currentTime = new Date();

                var currentPos = (currentTime.getHours() * 30) + (currentTime.getMinutes() / 2);
                element.css({"bottom": currentPos + "px"});

                $rootScope.getTimePointerPos = function () {
                    return currentPos;
                };

                // used to update the UI
                function updateTimePointerPos() {
                    currentPos += 0.5;
                    element.css({"bottom": currentPos + "px"});
                }

                // schedule update in one second
                var firstUpdate = true;
                function updateLater() {
                    var updateIntensity = 0;

                    if (firstUpdate) {
                        updateIntensity = (60 - currentTime.getSeconds()) * 1000;
                        firstUpdate = false;
                    } else updateIntensity = 60000;

                    timeoutId = $timeout(function () {
                        updateTimePointerPos(); // update DOM
                        updateLater(); // schedule another update
                    }, updateIntensity);
                }

                updateLater(); // kick off the UI update process.
            }
        });
})();