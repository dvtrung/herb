var markdown = require('markdown');
module.exports = {
    mdText: '',
    toHTML: function() {
        alert(markdown.toHTML(mdText));
    }
}
