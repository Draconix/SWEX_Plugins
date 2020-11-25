// Plugin by @dannybaker#2858 on discord
const { dialog, BrowserWindow } = require('electron')
const path = require('path');
var player = require('play-sound')( opts = {
  players: ['mplayer', 'wmplayer', 'vlc', 'nvlc', 'afplay', 'aplay', 'cmdmp3', 'sox'] 
})


module.exports = {
  defaultConfig: {
    enabled: false,
    dungeonAlert: true,
    raidAlert: true,
    useSound: true,
    forceFront: true,
    raidDelay: 10,
  },
  defaultConfigDetails: {
    dungeonAlert: { label: 'Repeat battle reminder' },
    raidAlert: { label: 'Raid reminder' },
    useSound: { label: 'Audio alert' },
    forceFront: { label: 'Force window front' },
    raidDelay: { label: 'Time in seconds between raid boss defeat and alert. \
                        (default 10s to skip animations):', type: 'textarea' },
  },
  // Plugin meta data to better describe your plugin
  pluginName: 'Battle Reminder',
  pluginDescription: 'Alerts the user when selected runs are complete. Restart SWEX to enable. \
            \n\n\nPlugin by @dannybaker#2858 on discord, please contact me for issues.',
  startDungeon: 'BattleDungeonStart',
  endDungeon: 'BattleDungeonResult_V2',
  startScenario: 'BattleScenarioStart',
  endScenario: 'BattleScenarioResult',
  endRaid: 'BattleRiftOfWorldsRaidResult',
  battleStarted: false, 
  timeout: 20000,
  useSound: true,
  soundFile: path.join(__dirname, 'ding.mp3'),

  init(proxy, config) {
    if (config.Config.Plugins[this.pluginName].enabled) {

      // Login items
      this.useSound = config.Config.Plugins[this.pluginName].useSound;
      this.forceFront = config.Config.Plugins[this.pluginName].forceFront;
      initMessage = 'Battle alert plugin initiated.  Please check settings tab for config options.' 
      proxy.log({ type: 'info', source: 'plugin', name: this.pluginName, 
        message: initMessage });
      // Check if user has available audio players
      if(this.useSound){
        let playerAvail = true;
        player.play(this.soundFile, { timeout: 300 }, function(err){
          if (err){
            proxy.log({ type: 'error', source: 'plugin', name: 'Battle Reminder', 
              message: 'No available command line audio players.  Disabling sound for now.  \
                Check README for potential solutions.' });
            playerAvail = false;
          }
        })
        this.useSound = playerAvail;
      }
      this.alert(proxy, 'Example notification.')
      

      // Start request just used to track run number
      proxy.on(this.startDungeon, (req, resp) => {
          this.battleStarted = true;
          this.startedRun(proxy, req, resp);
      });
      proxy.on(this.startScenario, (req, resp) => {
          this.battleStarted = true;
          this.startedRun(proxy, req, resp);
      });

      // On end request, alert if no new start request comes within [timeout]
      proxy.on(this.endDungeon, (req, resp) => {
          this.battleStarted = false;

          if (config.Config.Plugins[this.pluginName].dungeonAlert) {
            this.awaitNewBattle(proxy, req, resp);
          }
      });
      proxy.on(this.endScenario, (req, resp) => {
          this.battleStarted = false;

          if (config.Config.Plugins[this.pluginName].dungeonAlert) {
            this.awaitNewBattle(proxy, req, resp);
          }
      });

      // On raid end, alert (with delay for animation)
      proxy.on(this.endRaid, (req, resp) => {

        if (config.Config.Plugins[this.pluginName].raidAlert) {

          timeout = parseInt(config.Config.Plugins[this.pluginName].raidDelay) * 1000; // seconds to milis
          setTimeout( () => {
              this.alert(proxy, 'Raid completed.')
          }, timeout); 
//           setTimeout(this.alert(proxy, 'Raid completed.'), timeout); 
        }
      });
    }
  },
  /*
   *  local functions 
   */
  startedRun(proxy, req) {
    proxy.log({ type: 'debug', source: 'plugin', name: this.pluginName, message: `Run #${req.auto_repeat}` });
  },
  awaitNewBattle(proxy, req) {
    proxy.log({ type: 'debug', source: 'plugin', name: this.pluginName, message: `Waiting for next battle.` });
    
    // Add a new listener to start that sets a flag
    function startHandler() {
      this.battleStarted = true;
    }
    proxy.on(this.startDungeon, startHandler);
    proxy.on(this.startScenario, startHandler);

    // If the flag is not received in time, remove listener and alert
    setTimeout( () => {
      proxy.removeListener(this.startDungeon, startHandler)
      proxy.removeListener(this.startScenario, startHandler)
      if( !this.battleStarted ) {
        this.alert(proxy, 'Runs completed.')
      }
    }, this.timeout); 
  },

  alert(proxy, message) {
    if(message != 'Example notification.'){
      proxy.log({ type: 'info', source: 'plugin', name: this.pluginName, message: message });
      // Already played sound on startup to test players
      if (this.useSound){
        proxy.log({ type: 'info', source: 'plugin', name: this.pluginName, message: this.useSound });
        this.playSound(proxy);
      } 
    }
    this.displayPopup(proxy, message);
  },
  playSound(proxy) {
    // Should work cross-platform
    player.play(this.soundFile, { timeout: 300 }, function(err){
      if (err){
        proxy.log({ type: 'error', source: 'plugin', name: this.pluginName, message: err });
      }
    })
  },
  displayPopup(proxy, message){
    // Window must be passed to make this non-blocking

    options = {
      buttons: ['OK'],
      title: 'Battle Reminder',
      message: message
    }
    dialog.showMessageBox(global.win, options, (err) => {
      if (err){
        proxy.log({ type: 'error', source: 'plugin', name: this.pluginName, message: err });
      }
    })
    // Bring to front
    if( this.forceFront ) global.win.show();
  },
};

