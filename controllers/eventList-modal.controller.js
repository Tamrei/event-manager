(function () {
    'use strict';

    angular
        .module('eventList-modal.controller', [])
        .controller("eventListModalController", ["$scope", "$rootScope", "$uibModalInstance", "calendarService", "storageService",
            function ($scope, $rootScope, $uibModalInstance, calendarService, storageService) {
                //$scope.isCollapsed = true;
                $scope.sortedList = storageService.getSortedEventList();

                $scope.goToEvent = function (event) {
                    var date = event.key.split('.');
                    var weekNumber = calendarService.getWeekNumberByDate(date[1], date[0], date[2]);

                    var obj = {
                        weekNumber: weekNumber | 0,
                        year: date[2],
                        eventStartTime: event.from
                    };

                    $uibModalInstance.close(obj);
                };

                $scope.orderByStartTime = function (event) {
                    return parseFloat(event.from.hour + "." + event.from.minutes);
                };

                $scope.close = function () {
                    $uibModalInstance.dismiss('cancel');
                };

            }]);
})();
