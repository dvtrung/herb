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
                                'content': comment[0],
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
                            ch: comment.ch + comment.content.length
                        }, {
                            scroll: true
                        });
                    },

                    reloadMissingWords: function() {
                        var section = docSection.getCurrentSection();
                        self.comments.missing_words = getRegexResults(/\[\]\([^\)]*\)/g, section.line_start, section.line_end);
                    },

                    reloadNeedCorrectionWords: function() {
                        var section = docSection.getCurrentSection();
                        self.comments.need_correction_words = getRegexResults(/\[[^\]]*\]\(\?\)/g, section.line_start, section.line_end);
                    },

                    reloadTodos: function() {
                        self.comments.todos = getRegexResults(/\[TODO\]: # \([^\)]*\)/g);
                    },

                    refresh: function() {
                        self.reloadMissingWords();
                        self.reloadNeedCorrectionWords();
                        self.reloadTodos();
                    }

                };

                return self;
            }
        ])

})();
