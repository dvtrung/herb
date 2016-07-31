const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;
const {dialog} = require('electron');
const {ipcMain} = require('electron');

var exporter = require('./libs/exporter.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    //if (process.platform != 'darwin') {
        app.quit();
    //}
});

app.on('activate', () => {
    //app.openProject();
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    //app.loadProject("/Users/trung/Documents/novel");
    app.openProject();
});

app.openProject = function() {
    dialog.showOpenDialog({
        properties: [ 'openDirectory' ],
        filters: [
            { name: 'Markdowns', extensions: ['md'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    }, function (path) {
        if (path) {
            app.loadProject(path[0]);
        }
    });
}

app.startWindow = function() {
    win = new BrowserWindow({
        'min-width': 500,
        'min-height': 200,
        'accept-first-mouse': true,
        'title-bar-style': 'hidden',
    });

    win.loadURL('file://' + __dirname + '/start.html');
}

app.loadProject = function (path) {
    // Create the browser window.
    win = new BrowserWindow({
        'min-width': 500,
        'min-height': 200,
        'accept-first-mouse': true,
        'title-bar-style': 'hidden',
        'fullscreen': true
    });

    // and load the index.html of the app.
    win.loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    // mainWindow.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('load-project', { 'path': path });
    });
}

app.newProject = function() {
    // Create the browser window.
    win = new BrowserWindow({
        'min-width': 500,
        'min-height': 200,
        'accept-first-mouse': true,
        'title-bar-style': 'hidden',
        'fullscreen': true
    });

    // and load the index.html of the app.
    win.loadURL('file://' + __dirname + '/index.html');
}

app.saveProject = function() {
    win = BrowserWindow.getFocusedWindow();
    win.webContents.send('save-project');
}

app.exportTo = function(fileType) {
    exporter.mdText = 'abc Test';
    if (fileType == "html") {
        exporter.toHTML();
    }
}
