(function() {

    'use strict';

    angular.module('common.services')
        .factory('section', [
            'simplemde',
            function(simplemde) {
                var self = {
                    sections: [],
                    section_arr: [],
                    currentSection: null,

                    getHeadingLevel: function(str) {
                        if (!str) return 0;
                        if (str.trim().substring(0, 3) == '## ') return 2;
                        else if (str.trim().substring(0, 2) == '# ') return 1;
                        return 0;
                    },

                    getHeadingTitle: function(str) {
                        if (!str) return null;
                        while (str[0] == '#')
                            return str.replace(/^[#]+/g, '').trim();
                    },

                    getSection: function(line) {
                        if (line >= simplemde.codemirror.getDoc().lineCount()) return null;
                        var section = {};
                        section.lines = [];
                        var current_line = line + 1;
                        var content = '';
                        while (current_line >= 0 && self.getHeadingLevel(content) == 0) {
                            current_line--;
                            content = simplemde.codemirror.getLine(current_line);
                        }
                        if (line < 0) return null;
                        section.title = self.getHeadingTitle(content);
                        section.level = self.getHeadingLevel(content);
                        section.line_start = current_line;

                        content = '';
                        current_line = line;
                        while (current_line < simplemde.codemirror.getDoc().lineCount() && self.getHeadingLevel(content) == 0) {
                            current_line++;
                            content = simplemde.codemirror.getLine(current_line);
                        }
                        section.line_end = current_line - 1;

                        return section;
                    },

                    getCurrentSection: function() {
                        var cs = simplemde.codemirror.getCursor();
                        return self.getSection(cs.line);
                    },

                    getSectionOnCursor: function() {
                        var cs = simplemde.codemirror.getCursor();
                        var i;
                        for (i = 0; i < self.section_arr.length; i++) {
                            if ((cs.line >= self.section_arr[i].line_start) && (cs.line <= self.section_arr[i].line_end)) {
                                return self.section_arr[i];
                            }
                        }
                    },

                    refresh: function() {
                        var line = 0;
                        var section = self.getSection(line);
                        var count = 0;

                        var currentSection = null,
                            prevSection = {
                                'level': 0
                            };

                        self.section_arr = [];
                        self.sections = [];

                        while (section) {
                            if (section.level > prevSection.level) { // Jump to new level
                                currentSection = prevSection;
                            } else if (section.level < prevSection.level) { // Jump back
                                currentSection = currentSection.parent;
                            }

                            section.parent = currentSection;
                            section.pages = [];
                            section.icon = '';
                            section.id = count++;
                            self.section_arr[section.id] = section;

                            if (currentSection.level === 0) {
                                section.type = 'toggle';
                                self.sections.push(section);
                            } else {
                                section.type = 'link';
                                currentSection.pages.push(section);
                            }

                            prevSection = section;

                            line = section.line_end + 1;
                            section = self.getSection(line);
                        }
                    },

                    goToSection: function(section) {
                        //var t = simplemde.codemirror.charCoords({line: section.line_start, ch: 0}, "local").top;
                        simplemde.codemirror.setCursor({
                            line: section.line_start,
                            ch: 0
                        }, null, {
                            'scroll': false
                        });
                        var t = simplemde.codemirror.heightAtLine(section.line_start, 'local');
                        simplemde.codemirror.scrollTo(null, t);
                        //$rootScope.refreshSectionSelection();
                        //var t = simplemde.codemirror.heightAtLine(section.line_start, 'local');
                        //simplemde.codemirror.scrollIntoView({ line: section.line_start, ch: 0 });
                        //simplemde.codemirror.scrollTo(null, t);
                        //$rootScope.refreshSectionSelection();
                    },

                };

                return self;
            }
        ])

})();
