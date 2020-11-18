// Plugin by @dannybaker#2858 on discord
const { dialog } = require('electron')
const { BrowserWindow } = require('electron');

module.exports = {
  defaultConfig: {
    enabled: false
  },
  // Plugin meta data to better describe your plugin
  pluginName: 'Raid Battle Reminder',
  pluginDescription: 'Raises an alert when the raid battle is completed. Restart SWEX to enable.'
              + '\n\nPlugin by @dannybaker#2858 on discord, please contact me for issues.',
  startRaid: 'BattleRiftOfWorldsRaidStart',
  endRaid: 'BattleRiftOfWorldsRaidResult',
  initMessage: 'Raid alert active.',
  init(proxy, config) {
    if (config.Config.Plugins[this.pluginName].enabled) {
      // Show login info
      proxy.log({ type: 'info', source: 'plugin', name: this.pluginName, message: this.initMessage });

      proxy.on(this.endRaid, (req, resp) => {
          this.alert(proxy, req, resp);
      });
    }
  },

  alert(proxy) {
    proxy.log({ type: 'info', source: 'plugin', name: this.pluginName, message: `Raid battle completed.` });
    // Pop-up
    let options  = {
     buttons: ["OK"],
     message: "Raid completed."
    }
    // Window must be passed to make this non-blocking
    dialog.showMessageBox(global.win, options);
    // Bring to front
    global.win.show();

  },
};

