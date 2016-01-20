(function () {
    'use strict';

    angular
        .module('validateTime.directive', [])
        .directive('timeLeft', validateTime);

    function validateTime() {
        return {
            link: function (scope) {
                if (scope.time % 60 == 0) {
                    scope.time = scope.time / 60 + 'hour/s';
                } else if (scope.time / 60 < 1) {
                    scope.time = scope.time % 60 + 'min.'; //change to int
                } else {
                    scope.time = Math.round(scope.time / 60) + 'hour. ' +  scope.time % 60 + 'min.';
                }
            },
            restrict: 'E',
            scope: {time: '='},
            template: '{{time}}'
        };
    }
})
();
