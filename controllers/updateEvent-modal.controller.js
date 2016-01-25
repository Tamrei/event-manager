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
                    $uibModalInstance.close();
                };

                $scope.close = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]);
})();
