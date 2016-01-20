(function () {
    'use strict';

    angular
        .module('updateEvent-modal.controller', ['ui.bootstrap'])
        .controller("updateEventModalController", ["$scope", "$uibModalInstance", "$uibModal", "selectedDay", "selectedEvent", "storageService", "$filter", "eventIndex",
            function ($scope, $uibModalInstance, $uibModal, selectedDay, selectedEvent, storageService, $filter, eventIndex) {
                $scope.event = selectedEvent;
                $scope.date = selectedDay;

                /**
                 * Opens confirm-delete modal
                 */
                $scope.deleteEvent = function () {
                    var confirmDeleteModal = $uibModal.open({
                        controller: "confirmDeleteController",
                        templateUrl: "confirmDelete.html",
                        resolve: {
                            key: function () {
                                return selectedDay.key;
                            },
                            eventToDelete: function () {
                                return selectedEvent;
                            },
                            eventIndex: function () {
                                return eventIndex;
                            }
                        }
                    });
                    confirmDeleteModal.result.then(function () {
                        $uibModalInstance.close();
                    }, function () {
                    });
                };

                $scope.updateEvent = function () {
                    storageService.updateEvent(selectedDay.key, selectedEvent, eventIndex);
                    var obj = {
                        index: eventIndex,
                        event: selectedEvent
                    };
                    $uibModalInstance.close(obj);
                };

                $scope.close = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]);
})();
