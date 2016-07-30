(function() {

    'use strict';

    angular.module('common.services')
        .factory('project', [
            'simplemde',
            function(simplemde) {

                function loadContent(callback) {
                    var fs = require('fs');
                    fs.readFile(self.path + '/main.md', 'utf8', function(err, data) {
                        self.content = data;
                        simplemde.value(data);
                        self.flagChanged = false;
                        callback();
                    });
                }

                function saveContent() {
                    var fs = require('fs');
                    fs.writeFile(self.path + '/main.md', simplemde.value(), function(err) {
                        if (err) {
                            alert(err);
                        }
                    });
                }

                function loadCharacters() {
                    var fs = require('fs');
                    var character = JSON.parse(fs.readFileSync(self.path + '/characters.json', 'utf8'));
                    self.characters = character.list;
                }

                function saveCharacters() {
                    var fs = require('fs');
                    fs.writeFile(self.path + '/characters.json', JSON.stringify({
                        list: self.characters
                    }));
                }

                var self = {
                    path: '',
                    characters: [],
                    content: '',
                    flagChanged: false,

                    loadProject: function(path, callback) {
                        self.path = path;
                        loadContent(callback);
                        loadCharacters();

                        self.flagChanged = false;
                    },

                    saveProject: function() {
                        saveContent();
                        saveCharacters();

                        self.flagChanged = false;
                    },
                }

                return self;
            }
        ])

})();
