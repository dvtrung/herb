(function() {

    'use strict';

    angular.module('common.services')
        .factory('simplemde', [
            function(project) {
                var simplemde = new SimpleMDE({
                    autofocus: true,
                    forceSync: true,
                    hideIcons: ["guide", "heading"],
                    indentWithTabs: false,
                    insertTexts: {
                        horizontalRule: ["", "\n\n-----\n\n"],
                        image: ["![](http://", ")"],
                        link: ["[", "](http://)"],
                        table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n"],
                    },
                    lineWrapping: true,
                    parsingConfig: {
                        //allowAtxHeaderWithoutSpace: true,
                        //strikethrough: false,
                        //underscoresBreakWords: true,
                    },
                    previewRender: function(plainText) {
                        return customMarkdownParser(plainText); // Returns HTML from a custom parser
                    },
                    previewRender: function(plainText, preview) { // Async method
                        setTimeout(function() {
                            preview.innerHTML = customMarkdownParser(plainText);
                        }, 250);

                        return "Loading...";
                    },
                    promptURLs: true,
                    renderingConfig: {
                        //singleLineBreaks: false,
                    },
                    shortcuts: {
                        //drawTable: "Cmd-Alt-T"
                    },
                    showIcons: ["code", "table"],
                    spellChecker: false,
                    status: false,
                    styleSelectedText: false,
                    tabSize: 4,
                    toolbar: false,
                    toolbarTips: false,
                });

                return simplemde;
            }
        ])

})();
