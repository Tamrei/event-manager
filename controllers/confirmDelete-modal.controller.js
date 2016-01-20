(function () {
    'use strict';

    angular
        .module('confirmDelete-modal.controller', [])
        .controller("confirmDeleteController", ["$scope", "$rootScope", "$uibModalInstance", "key", "eventToDelete", "storageService", "eventIndex",
            function ($scope, $rootScope, $uibModalInstance, key, eventToDelete, storageService, eventIndex) {

            $scope.confirmDelete = function () {
                storageService.deleteEvent(key, eventIndex);
                $uibModalInstance.close();
            };

            $scope.close = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
})();
