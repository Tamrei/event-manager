(function () {
    'use strict';

    angular.module('time-pointer.directive', [])
        // Register the 'myCurrentTime' directive factory method.
        // We inject $timeout and dateFilter service since the factory method is DI.
        .directive('timePointer', function ($compile, $timeout, $rootScope) {
            // return the directive link function. (compile function not needed)
            return function (scope, element, attrs) {
                var timeoutId; // timeoutId, so that we can cancel the time updates
                var currentTime = new Date();

                var currentPos = (currentTime.getHours() * 30) + (currentTime.getMinutes() / 2);
                element.css({"bottom": currentPos + "px"});

                //$rootScope.timePointerPos = currentPos;

                $rootScope.getTimePointerPos = function () {
                    return currentPos;
                };

                // used to update the UI
                function updateTimePointerPos() {
                    currentPos += 0.5;
                    //$rootScope.timePointerPos = currentPos;
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

                // listen on DOM destroy (removal) event, and cancel the next UI update
                // to prevent updating time ofter the DOM element was removed.
                element.bind('$destroy', function () {
                    $timeout.cancel(timeoutId);
                });

                updateLater(); // kick off the UI update process.
            }
        });
})();