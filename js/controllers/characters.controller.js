(function() {
    'use strict';

    angular.module('myApp.controllers')

    .controller('charactersCtrl', [
        '$scope',
        '$log',
        '$state',
        '$timeout',
        '$location',
        'project',
        function($scope, $log, $state, $timeout, $location, project) {
            $scope.characters = project.characters;
            $scope.selectedCharacter = null;

            $scope.select = function(character) {
                $scope.selectedCharacter = character;
            }
        }
    ])
})();
