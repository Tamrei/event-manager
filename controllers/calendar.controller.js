(function () {
    'use strict';

    angular
        .module('calendar.controller', [])
        .controller("calendarController", ["calendarService", "storageService", "$timeout", "$scope", "$location",
            "$rootScope", "$uibModal",
            function (calendarService, storageService, $timeout, $scope, $location, $rootScope, $uibModal) {
                $scope.eventCount = localStorage.length;
                $scope.today = new Date();

                var path = $location.path();
                if (path == "") {
                    //$scope.weekChangeAnimation = "repeat-animation";
                    $location.path(calendarService.getCurrentWeek() + "/" + new Date().getFullYear());
                }

                $scope.goToDate = function () {
                    $scope.selectedEventStartTime = undefined;
                    //$scope.weekChangeAnimation = "repeat-animation";
                    $location.path(calendarService.getWeekNumberByDate($scope.navigate.day,
                            $scope.navigate.month, $scope.navigate.year) + "/" + $scope.navigate.year);
                };

                /**
                 * navigate to today
                 */
                $scope.goToToday = function () {
                    $scope.selectedEventStartTime = undefined;
                    //$scope.weekChangeAnimation = "repeat-animation";
                    $location.path(calendarService.getCurrentWeek() + "/" + new Date().getFullYear());
                };

                $scope.nextWeek = function () {
                    $scope.selectedEventStartTime = undefined;
                    //$scope.weekChangeAnimation = "nextWeek";
                    $scope.weekNumb++;
                };

                $scope.prevWeek = function () {
                    $scope.selectedEventStartTime = undefined;
                    //$scope.weekChangeAnimation = "prevWeek";
                    $scope.weekNumb--;
                };

                $rootScope.$on('$locationChangeSuccess', function () {
                    updateWeekPanel();
                });

                var timeoutId;

                // used to update the UI
                function updateUpcomingEvents() {
                    $scope.upcomingEvents = storageService.getIncomingEvents();

                    var currentTime = new Date();

                    // if next day began update week panel
                    if (currentTime.getHours() == 0 && currentTime.getMinutes() == 0) {
                        updateWeekPanel();
                    }
                }

                updateUpcomingEvents();

                // schedule update in one second
                var firstUpdate = true;

                function updateLater() {
                    var updateIntensity = 0;

                    if (firstUpdate) {
                        updateIntensity = (60 - $scope.today.getSeconds()) * 1000;
                        firstUpdate = false;
                    } else updateIntensity = 60000;

                    timeoutId = $timeout(function () {
                        updateUpcomingEvents(); // update DOM
                        updateLater(); // schedule another update
                    }, updateIntensity);
                }

                updateLater(); // kick off the UI update process.

                /**
                 * Opens modal that contains data about all events
                 *
                 * @constructor
                 */
                $scope.OpenEventList = function () {
                    var eventListModal = $uibModal.open({
                        controller: "eventListModalController",
                        templateUrl: "eventList.html",
                        size: "lg"
                    });
                    eventListModal.result.then(function (obj) {
                        //TODO: redo
                        $scope.selectedEventStartTime = obj.eventStartTime;
                        $location.path(obj.weekNumber + "/" + obj.year);
                    }, function () {
                    });
                };

                var isUpdateModalOpened = false;
                $scope.open = function (selectedDay, selectedEvent, index) {
                    if (selectedEvent !== undefined && !isUpdateModalOpened) {
                        isUpdateModalOpened = true;

                        var updateModal = $uibModal.open({
                            controller: "updateEventModalController",
                            templateUrl: "updateModal.html",
                            resolve: {
                                selectedDay: function () {
                                    return selectedDay;
                                },
                                selectedEvent: function () {
                                    return selectedEvent;
                                },
                                eventIndex: function () {
                                    return index;
                                }
                            }
                        });
                        updateModal.result.then(function () {
                            //TODO: redo
                            $scope.eventCount = localStorage.length;
                            $scope.week = calendarService.getWeekByNumber($scope.weekNumb, $scope.yearNumber);
                            updateUpcomingEvents();
                        }, function () {
                        });
                        return;
                    }
                    else if (!isUpdateModalOpened) {
                        var addEventModal = $uibModal.open({
                            controller: "calendarModalController",
                            templateUrl: 'calendarModal.html',
                            resolve: {
                                selectedDay: function () {
                                    return selectedDay;
                                }
                            }
                        });
                        addEventModal.result.then(function () {
                            //TODO: redo
                            $scope.eventCount = localStorage.length;
                            $scope.week = calendarService.getWeekByNumber($scope.weekNumb, $scope.yearNumber);
                            updateUpcomingEvents();
                        }, function () {
                        });
                    }
                    isUpdateModalOpened = false;
                };

                function updateWeekPanel() {
                    var path = $location.path();

                    var week = path.match(/[^a-zA-Z!@#\$%\^\&*/]\d{0,1}/);
                    var year = path.match(/[^a-zA-Z!@#\$%\^\&*/]\d{3}/);

                    if (week < 0) {
                        $location.path(calendarService.getWeeksInYear(--year) + "/" + year);
                        return;
                    }
                    if (week > 50 && week > calendarService.getWeeksInYear(year)) {
                        $location.path(0 + "/" + ++year);
                        return;
                    }

                    $scope.weekNumb = week;
                    $scope.yearNumber = year[0];

                    $scope.week = calendarService.getWeekByNumber(week, year);
                }
            }]);
})();
