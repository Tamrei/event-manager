(function () {
    'use strict';

    angular
        .module('calendar-modal.controller', [])
        .controller("calendarModalController", ["$scope", "$rootScope", "$uibModalInstance", "$sce", "selectedDay", "$filter", "storageService",
            function ($scope, $rootScope, $uibModalInstance, $sce, selectedDay, $filter, storageService) {
                $scope.date = selectedDay;

                /**
                 * saves event in local storage
                 */
                $scope.saveEvent = function () {
                    if ($scope.eventForm.$valid) {
                        try {
                            var key = selectedDay.getMonth() + 1 + "." + selectedDay.getDate() + "." + selectedDay.getFullYear();
                            storageService.saveEvent(key, $scope.event);
                            $uibModalInstance.close();
                        } catch (overlapError) {
                            $scope.overlapError = $sce.trustAsHtml(overlapError);
                        }
                    }
                };

                $scope.isEventTimeValidScp = function (event) {
                    return isEventTimeValid(event);
                };

                function isEventTimeValid(event) {
                    event = $scope.event;

                    if (event && event.from && event.to) {
                        var isValid = (event.from.hour > event.to.hour)
                            || event.from.hour == event.to.hour && event.from.minutes >= event.to.minutes;
                        return isValid || (event.from.hour == 0 && event.to.hour == 0 && event.from.minutes >= event.to.minutes);
                    }
                }

                $scope.close = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]);
})();
