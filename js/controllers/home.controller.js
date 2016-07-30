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
        function($rootScope, $log, $state, $timeout, $location, menu, simplemde, docSection, project, comment) {

            $state.go('home');

            var vm = this;

            $rootScope.showMainView = true;
            $rootScope.comment = comment;
            $rootScope.menu = menu;

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
                    $rootScope.reloadSections();
                }
                $rootScope.$apply();
            });

            simplemde.codemirror.on('cursorActivity', function(doc) {
                comment.refresh();
                $rootScope.refreshSectionSelection();
                $rootScope.$apply();
            });

            simplemde.codemirror.on("change", function() {
                //getScope().reloadContent();
                project.flagChanged = true;
            });


            require('electron').ipcRenderer.on('load-project', (event, args) => {
                project.loadProject(args.path, function() {
                    $rootScope.reloadContent();
                });
            });

            require('electron').ipcRenderer.on('save-project', (event, args) => {
                project.saveProject();
            })

            $rootScope.reloadContent = function() {
                $rootScope.reloadSections();
                comment.refresh();
                $rootScope.$apply();
            }

            $rootScope.refreshSectionSelection = function() {
                var cs = simplemde.codemirror.getCursor();
                var i;
                for (i = 0; i < docSection.section_arr.length; i++) {
                    if ((cs.line >= docSection.section_arr[i].line_start) && (cs.line <= docSection.section_arr[i].line_end)) {
                        menu.setCurrentPage(docSection.section_arr[i].parent, docSection.section_arr[i]);
                        break;
                    }
                }
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

            $rootScope.reloadSections = function() {
                menu.refresh();
                vm.menu = menu;
            }
        }
    ])
})();
