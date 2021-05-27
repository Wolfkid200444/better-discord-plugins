/**
 * @name Clap
 * @source https://github.com/wolfkid200444/better-discord-plugins/blob/master/Clap/Clap.plugin.js
 * @updateUrl https://raw.githubusercontent.com/wolfkid200444/better-discord-plugins/master/Clap/Clap.plugin.js
 * @website https://github.com/wolfkid200444/better-discord-plugins/tree/master/Clap/Clap.plugin.js
 * @authorId 282978672711827456
 */

/*@cc_on
@if (@_jscript)
	
  // Offer to self-install for clueless users that try to run this directly.
  var shell = WScript.CreateObject("WScript.Shell");
  var fs = new ActiveXObject("Scripting.FileSystemObject");
  var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
  var pathSelf = WScript.ScriptFullName;
  // Put the user at ease by addressing them in the first person
  shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
  if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
     shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
  } else if (!fs.FolderExists(pathPlugins)) {
     shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
  } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
     fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
     // Show the user where to put plugins in the future
     shell.Exec("explorer " + pathPlugins);
     shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
  }
  WScript.Quit();
@else@*/

module.exports = (() => {
    const config = {
       main: 'index.js',
       info: {
          name: 'Clap',
          authors: [
             {
                name: 'wolfie',
                discord_id: '282978672711827456',
                github_username: 'wolfkid200444',
                twitter_username: ''
             }
          ],
          version: '1.0.1',
          description: 'Clapify Your messages.',
          github: 'https://github.com/wolfkid200444',
          github_raw: 'https://raw.githubusercontent.com/wolfkid200444/better-discord-plugins/master/Clap/Clap.plugin.js'
       }
    };
 
    const buildPlugin = ([Plugin, API]) => {
       return class Clap extends Plugin {
          constructor() {
             super();
          }
 
          async start() {
             commands.register({
                command: 'clap',
                description: 'Clap your nessages...',
                usage: '{c} [text to mock]',
                executor: (args) => ({
                   send: true,
                   result: args.join(' ').toLowerCase().split('').map(L => {
                    return `${L}`;
                }).join(' 👏 ')
                })
             });
          };
 
          stop() {
             commands.unregister('clap');
          };
       };
    };
 
    return !global.ZeresPluginLibrary || !global.XenoLib || !global.commands ? class {
       constructor() {
          this._XL_PLUGIN = true;
          this.start = this.load = this.handleMissingLib;
       }
 
       getName() {
          return this.name.replace(/\s+/g, '');
       }
 
       getAuthor() {
          return this.author;
       }
 
       getVersion() {
          return this.version;
       }
 
       getDescription() {
          return this.description + ' You are missing libraries for this plugin, please enable the plugin and click Download Now.';
       }
 
       start() { }
 
       stop() { }
 
       handleMissingLib() {
          let missing = {
             ZeresPluginLibrary: false,
             CommandsAPI: false
          };
          if (!global.ZeresPluginLibrary) missing.ZeresPluginLibrary = true;
          if (!global.commands) missing.CommandsAPI = true;
          let missingCount = 0;
          Object.values(missing).map(m => m ? missingCount++ : '');
 
          BdApi.showConfirmationModal(missingCount == 1 ? 'Library plugin needed' : 'Library plugins needed',
             `The library plugin${missingCount > 1 ? 's' : ''} needed for ${config.info.name} is missing. Please click Download to install the dependecies.`, {
             confirmText: 'Download',
             cancelText: 'Cancel',
             onConfirm: async () => {
                if (missing.ZeresPluginLibrary) {
                   await new Promise((fulfill, reject) => {
                      require('request').get('https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js', async (error, response, body) => {
                         if (error) {
                            return electron.shell.openExternal('https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js');
                         }
                         require('fs').writeFile(require('path').join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'), body, fulfill);
                      });
                   });
                }
                if (missing.CommandsAPI) {
                   await new Promise((fulfill, reject) => {
                      require('request').get('https://raw.githubusercontent.com/slow/better-discord-plugins/master/CommandsAPI/CommandsAPI.plugin.js', async (error, response, body) => {
                         if (error) {
                            return electron.shell.openExternal('https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/slow/better-discord-plugins/master/CommandsAPI/CommandsAPI.plugin.js');
                         }
                         require('fs').writeFile(require('path').join(BdApi.Plugins.folder, 'CommandsAPI.plugin.js'), body, fulfill);
                      });
                   });
                }
             }
          });
       }
 
       get [Symbol.toStringTag]() {
          return 'Plugin';
       }
 
       get name() {
          return config.info.name;
       }
 
       get short() {
          let string = '';
          for (let i = 0, len = config.info.name.length; i < len; i++) {
             const char = config.info.name[i];
             if (char === char.toUpperCase()) string += char;
          }
          return string;
       }
 
       get author() {
          return config.info.authors.map(author => author.name).join(', ');
       }
 
       get version() {
          return config.info.version;
       }
 
       get description() {
          return config.info.description;
       }
    } : buildPlugin(global.ZeresPluginLibrary.buildPlugin(config));
 })();
