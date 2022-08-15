const {
  app,
  BrowserWindow,
  ipcMain,
  systemPreferences
} = require('electron')
const path = require('path')

systemPreferences.askForMediaAccess('camera').then(() => {
  // TODO send event to reinit the camera
})

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  process.exit();
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow,
  controlWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 1000,
    icon: path.join(__dirname, 'assets/icons/64x64.png'),
    frame: false,
    vibrancy: 'dark',
    darkTheme: true,
    acceptFirstMouse: true,
    show: false,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'src/scripts/preload.js'),
      nodeIntegration: true,
      // webSecurity: false
      enableRemoteModule: true
    },
  })

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Emitted when the window is closed.
  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  mainWindow.on('closed', () => {
    mainWindow = null
    app.quit()
  })
  mainWindow.on('ready-to-show', mainWindow.show)

  // mainWindow.openDevTools()
}

app.on('ready', createWindow)

ipcMain.on('POPOUT_CONTROLS', (event, model) => {
  if (!controlWindow) {
    controlWindow = new BrowserWindow({
      icon: path.join(__dirname, 'assets/icons/64x64.png'),
      frame: false,
      resizable: false,
      vibrancy: 'dark',
      darkTheme: true,
      show: false,
      acceptFirstMouse: true,
      webPreferences: {
        nodeIntegration: true,
      }
    })
    controlWindow.loadURL(`file://${__dirname}/controls.html`)
    controlWindow.on('closed', () => controlWindow = null)
    controlWindow.on('ready-to-show', () => {
      controlWindow.send('MODEL_INIT', model)
      controlWindow.show()
      controlWindow.focus()
    })
  } else {
    controlWindow.show()
    controlWindow.focus()
  }
})

// get model changes from sender and forward them to the other window
ipcMain.on('MODEL_CHANGE', (event, key, value) => {
  ([mainWindow]).forEach((win) => {
    // ([mainWindow, controlWindow]).forEach((win) => {
    // if (win && win.webContents.history[0] !== event.sender.history[0]) {
      try {
        win.send('MODEL_CHANGE', key, value)
      } catch(e){
        console.warn('could not serialize', key)
      }
    // }
  })
})

// forward action from remote/popped controls to main window
ipcMain.on('ACTION', (event, action) => {
  mainWindow.webContents.send('ACTION', action)
})
// app.on('will-quit', () => {
//   console.log('will-quit')
// })
