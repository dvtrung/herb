(function() {
    'use strict';

    angular.module('myApp.controllers')

    .controller('todoCtrl', [
        '$scope',
        'comment',
        function($scope, comment) {
            $scope.refresh = function() {
                comment.reloadTodos();
                $scope.todos = comment.comments.todos;
            }
        }
    ])
})();
