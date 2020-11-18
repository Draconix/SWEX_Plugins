// Plugin by @dannybaker#2858 on discord
const { dialog } = require('electron')
const { BrowserWindow } = require('electron');

module.exports = {
  defaultConfig: {
    enabled: false
  },
  // Plugin meta data to better describe your plugin
  pluginName: 'Repeat Battle Reminder',
  startBattle: 'BattleDungeonStart',
  endBattle: 'BattleDungeonResult_V2',
  startRaid: 'BattleRiftOfWorldsRaidStart',
  endRaid: 'BattleRiftOfWorldsRaidResult',
  initMessage: 'Repeat alert reminder started, running example notification.',
  battleStarted: 0, // Flag marking 1 if in run, 0 if it's over
  timeout: 20000,
  pluginDescription: 'Raises an alert when the x10 repeat battle is over. Restart SWEX to enable.'
              + '\n\nPlugin by @dannybaker#2858 on discord, please contact me for issues.',

  init(proxy, config) {
    if (config.Config.Plugins[this.pluginName].enabled) {
      // Show login info
      proxy.log({ type: 'info', source: 'plugin', name: this.pluginName, message: this.initMessage });
      this.demoAlert();

      // Listen for start and end of dungeon battles
      proxy.on(this.startBattle, (req, resp) => {
          this.battleStarted = 1;
          this.startedRun(proxy, req, resp);
      });
      proxy.on(this.endBattle, (req, resp) => {
          this.battleStarted = 0;
          this.awaitNewBattle(proxy, req, resp);
      });
    }
  },

  startedRun(proxy, req) {
    proxy.log({ type: 'debug', source: 'plugin', name: this.pluginName, message: `Run #${req.auto_repeat}` });
  },
  awaitNewBattle(proxy, req) {
    proxy.log({ type: 'debug', source: 'plugin', name: this.pluginName, message: `Waiting for next battle.` });
    
    // Add a new listener to start that sets a flag
    function startHandler() {
      this.battleStarted = 1;
    }
    proxy.on(this.startBattle, startHandler);

    // If the flag is not received in time, remove listener and alert
    setTimeout( () => {
      proxy.removeListener(this.startBattle, startHandler)
      if(this.battleStarted == 0) {
        this.alert(proxy)
      }
    }, this.timeout); 
  },
  alert(proxy) {
    proxy.log({ type: 'info', source: 'plugin', name: this.pluginName, message: `Repeat battle completed.` });
    // Pop-up
    let options  = {
     buttons: ["OK"],
     message: "Runs completed."
    }
    // Window must be passed to make this non-blocking
    dialog.showMessageBox(global.win, options, (response, checkboxChecked) => {
      proxy.log({ type: 'info', source: 'plugin', name: this.pluginName, message: `Why doesn't this show up?` });
    })
    // Bring to front
    global.win.show();

    // // Nice window, but it blocks 
    // dialog.showErrorBox('Runs Completed', 'Repeat battle terminated, press OK to continue.');
  },
  demoAlert() {
    let options  = {
     buttons: ["OK"],
     message: "Example notification.  Press OK to remove."
    }
    dialog.showMessageBox(global.win, options);
    global.win.show();
  },
};

