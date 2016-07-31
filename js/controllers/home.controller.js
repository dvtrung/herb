(function() {
    'use strict';

    angular.module('myApp.controllers')

    .controller('homeCtrl', [
        '$rootScope',
        '$log',
        '$state',
        '$timeout',
        '$location',
        'menu',
        'simplemde',
        'section',
        'project',
        'comment',
        '$mdDialog',
        '$mdMedia',
        function($rootScope, $log, $state, $timeout, $location, menu, simplemde, docSection, project, comment, $mdDialog, $mdMedia) {

            $state.go('home');

            var vm = this;

            $rootScope.showMainView = true;
            $rootScope.comment = comment;
            $rootScope.menu = menu;
            $rootScope.docSection = docSection;

            //functions for menu-link and menu-toggle
            vm.isExpanded = function(section) {
                return menu.isSectionExpanded(section);
            };
            vm.toggleSection = function(section) {
                menu.toggleSection(section);
            };
            vm.selectPage = function(section) {
                if (section.state) {
                    $state.go(section.state);
                    $rootScope.showMainView = false;
                } else {
                    docSection.goToSection(section);
                    $state.go('home');
                    $rootScope.showMainView = true;
                }
            };
            vm.isSelected = function(page) {
                return menu.currentPage === page;
            }
            vm.status = {
                isFirstOpen: true,
                isFirstDisabled: false
            };

            simplemde.codemirror.on('keyHandled', function(obj, name, e) {
                if (["Enter", "Up", "Down"].indexOf(name) != -1) {
                    menu.refresh();
                    $rootScope.checkCurrentSectionChanged();
                }
                $rootScope.$apply();
            });

            simplemde.codemirror.on('cursorActivity', function(doc) {
                checkCurrentSectionChanged();
                $rootScope.$apply();
            });

            simplemde.codemirror.on("change", function() {
                project.flagChanged = true;
            });

            function checkCurrentSectionChanged() {
                var newCurrentSection = docSection.getSectionOnCursor();
                if (docSection.currentSection != newCurrentSection) { // Changed
                    docSection.currentSection = newCurrentSection;
                    comment.refresh();
                    menu.setCurrentPage(docSection.currentSection.parent, docSection.currentSection);
                }
            };

            require('electron').ipcRenderer.on('load-project', (event, args) => {
                project.loadProject(args.path, function() {
                    $rootScope.reloadContent();
                });
            });

            require('electron').ipcRenderer.on('save-project', (event, args) => {
                project.saveProject();
            })

            $rootScope.reloadContent = function() {
                menu.refresh();
                $rootScope.$apply();
            }

            window.onbeforeunload = (e) => {
                if (!project.flagChanged) return;
                e.returnValue = false;
                var dialog = require('electron').remote.dialog;
                dialog.showMessageBox({
                    'type': 'question',
                    'buttons': ['Yes', 'No', 'Cancel'],
                    'title': 'Save Changes?',
                    'message': 'The file has changes, do you want to save them?',
                }, (response) => {
                    if (response == 0) {
                        project.saveProject();
                        window.close();
                    } else if (response == 1) {
                        project.flagChanged = false;
                        window.close();
                    }
                });

            }

            $rootScope.showTodoList = function(ev) {
                $mdDialog.show({
                        controller: function($scope, comment) {
                            comment.reloadTodos();
                            $scope.todos = comment.comments.todos;
                            console.debug($scope.todos);
                        },
                        templateUrl: 'js/templates/todo-list.tmpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: false
                    })
                    .then(function(answer) {
                        $rootScope.status = 'You said the information was "' + answer + '".';
                    }, function() {
                        $rootScope.status = 'You cancelled the dialog.';
                    });
                $rootScope.$watch(function() {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function(wantsFullScreen) {
                    $rootScope.customFullscreen = (wantsFullScreen === true);
                });
            }
        }
    ])
})();
