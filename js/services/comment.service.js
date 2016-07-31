(function() {

    'use strict';

    angular.module('common.services')
        .factory('comment', [
            'simplemde',
            'section',
            function(simplemde, docSection) {

                function getRegexResults(re, line_start, line_end) {
                    if (!line_start) line_start = 0;
                    if (!line_end) line_end = simplemde.codemirror.lineCount() - 1;
                    var ret = [];
                    var line;
                    for (line = line_start; line <= line_end; line++) {
                        var content = simplemde.codemirror.getLine(line);
                        var comment = re.exec(content);
                        while (comment) {
                            ret.push({
                                'match': comment,
                                'ch': comment.index,
                                'line': line,
                            });
                            comment = re.exec(content);
                        }
                    }
                    return ret;
                }

                var self = {
                    comments: {
                        'missing_words': [],
                        'need_correction_words': [],
                        'todos': [],
                        'comments': []
                    },

                    selectComment: function(comment) {
                        simplemde.codemirror.getDoc().setSelection({
                            line: comment.line,
                            ch: comment.ch
                        }, {
                            line: comment.line,
                            ch: comment.ch + comment.content[0].length
                        }, {
                            scroll: true
                        });
                    },

                    changeSectionInfo: function(comment) {
                        var title = comment.match[1];
                        var txt = section_info.escape(comment.unescape_text);
                        //txt = txt.replace('\n', "\\\\");
                        var str = "[<" + title + ">]: # (" + txt + ")";
                        simplemde.codemirror.getDoc().replaceRange(str,
                            { line: comment.line, ch: comment.ch },
                            { line: comment.line, ch: comment.ch + comment.match[0].length });
                        comment.match = [str, title, txt];
                    },

                    reloadMissingWords: function(section) {
                        self.comments.missing_words = getRegexResults(/( |^)(.{0,30})\[\]\(([^\)]*)\)(.{0,30})( |$)/g, section.line_start, section.line_end);
                    },

                    reloadNeedCorrectionWords: function(section) {
                        self.comments.need_correction_words = getRegexResults(/( |^)(.{0,30})\[([^\]]*)\]\(\?\)(.{0,30})( |$)/g, section.line_start, section.line_end);
                    },

                    reloadTodos: function() {
                        self.comments.todos = getRegexResults(/\[(.*)\]: # \(([^\)]*)\)/g);
                    },

                    refresh: function() {
                        self.reloadMissingWords(docSection.currentSection);
                        self.reloadNeedCorrectionWords(docSection.currentSection);
                        self.reloadTodos();
                        self.reloadSectionInfoFields(docSection.currentSection);
                        console.debug(self.section_info_fields);
                    },

                    reloadSectionInfoFields: function(section) {
                        self.section_info_fields = getRegexResults(/\[<(.*)>\]: # \((.*)\)/g, section.line_start, section.line_end);
                        var i; for (i = 0; i < self.section_info_fields.length; i++) {
                            self.section_info_fields[i].unescape_text = section_info.unescape(self.section_info_fields[i].match[2]);
                        }
                    }

                };

                var section_info = {
                    unescape: function(str) {
                        return str.replace(/\\\\/g, '\n');
                    },
                    escape: function(str) {
                        return str.replace(/\n/g, '\\\\');
                    }
                }

                return self;
            }
        ])

})();
