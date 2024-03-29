const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 1400,
        webPreferences: {
            preload: path.join(__dirname, 'main-preload.js')
          }
    });

    win.loadFile('index.html');
};

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    ipcMain.handle('start', () =>
    {
        // return 'battle.html'
    })
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});