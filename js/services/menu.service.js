(function() {

    'use strict';

    angular.module('common.services')
        .factory('menu', [
            '$location',
            'section',
            function($location, docSection) {

                var self = {
                    sections: [],
                    selected_section_id: 0,

                    toggleSection: function(section) {
                        section.is_expanded = !section.is_expanded;
                    },

                    selectPage: function(section, page) {
                        page && page.url && $location.path(page.url);
                    },

                    setCurrentPage: function(section, page) {
                        self.currentSection = section;
                        self.currentPage = page;
                    },

                    load: function() {
                        self.sections = [{
                            title: 'General',
                            state: 'home.general',
                            type: 'link',
                        }];
                        docSection.refresh();
                        var i;
                        for (i = 0; i < docSection.sections.length; i++) {
                            docSection.sections[i].is_expanded = true;
                            self.sections.push(docSection.sections[i]);
                        }
                    },

                    refresh: function() { self.load(); },
                };

                return self;
            }
        ])

})();
