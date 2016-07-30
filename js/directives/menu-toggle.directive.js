(function() {
    'use strict';
    angular.module('common.directives')
        .directive('menuToggle', ['$timeout', function($timeout) {
            return {
                scope: {
                    section: '='
                },
                templateUrl: 'partials/menu-toggle.tpl.html',
                link: function($scope, $element) {
                    var controller = $element.parent().controller();

                    $scope.isExpanded = function() {
                        return controller.isExpanded($scope.section);
                    };
                    $scope.toggleSection = function() {
                        controller.toggleSection($scope.section);
                    };

                    var parentNode = $element[0].parentNode.parentNode.parentNode;
                    if (parentNode.classList.contains('parent-list-item')) {
                        var heading = parentNode.querySelector('h2');
                        $element[0].firstChild.setAttribute('aria-describedby', heading.id);
                    }
                }
            };
        }])
})();
