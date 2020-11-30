# SWEX Plugins

## Installation:
1. Downloaded desired plugin folder (ie. battle_reminder)
2. Place this folder in the plugins folder for SWEX
3. Start SWEX and enable the plugin in the settings tab
4. Restart SWEX

## Plugin Descriptions:
**Battle Reminder** - This plugin alerts the user when SWEX detects the end of a x10 repeat battle or raid.  It alerts the user with a popup and a ding (disable in config).

**Suggestions** - Please reach out with ideas!

## Notes:

### Known Issues:
**No audio player** - Battle reminder relies on a command line media player in order to play the reminder ding.  OSX includes `afplay` by default but modern Windows installs do not.  There are a few options available.  The easiest options are to install [`VLC`](https://www.videolan.org/vlc/download-windows.html) or [`cmdmp3`](https://github.com/jimlawless/cmdmp3).  Once you have one of these installed, you need to add to path, [here's](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/) a good tutorial on that but here are some general paths.
1. Copy path to `cmdmp3.exe` or `VLC.exe`
2. Open the 'environment variable' settings page
3. Edit top 'Path' variable and paste the path to the executables
4. Click OK, click OK

### Future Distribution
Xzandro recommends .asar files for distribution (as opposed to folders).  This is ideal, and results in slightly smaller downloads. However, this has given me issues non-js dependencies (like the sound file used for the alert), so I'll use the unpackaged distributable until I find a solution.
