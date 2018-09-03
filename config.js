const config = {
  // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
  "ownerID": ["437525938582847489","365644930556755969"],

  // Bot Admins, level 9 by default. Array of user ID strings.
  "admins": [/*"437525938582847489"*/],

  // Bot Support, level 8 by default. Array of user ID strings
  "support": ["292936070603997185"],

  // Your Bot's Token. Available on https://discordapp.com/developers/applications/me

  "dashboard" : {
    "oauthSecret": "wWSwGW15hbyQiYFCTg8esL3MFfzvZsj1",
    "callbackURL": "https://tetrabot.herokuapp.com/callback",
    "sessionSecret": "Tetra",
    "domain": "https://tetrabot.herokuapp.com/",
    "port": 8080
  },
  // Default per-server settings. These settings are entered in a database on first load, 
  // And are then completely ignored from this file. To modify default settings, use the `conf` command.
  // DO NOT REMOVE THIS BEFORE YOUR BOT IS LOADED AND FUNCTIONAL.
  
  "defaultSettings" : {
    "prefix": "-",
    "modLogChannel": "mod-log",
    "modRole": "Moderator",
    "adminRole": "Administrator",
    "systemNotice": "true", // This gives a notice when a user tries to run a command that they do not have permission to use.
    "welcomeChannel": "welcome",
    "welcomeMessage": "Welcome {{user}}",
    "welcomeEnabled": "true"
  },

  // PERMISSION LEVEL DEFINITIONS.

  permLevels: [
    // This is the lowest permisison level, this is for non-roled users.
    { level: 0,
      name: "User", 
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },

    // This is your permission level, the staff levels should always be above the rest of the roles.
    { level: 2,
      // This is the name of the role.
      name: "Moderator",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
          if (modRole && message.member.roles.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: "Administrator", 
      check: (message) => {
        try {
          const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
          return (adminRole && message.member.roles.has(adminRole.id));
        } catch (e) {
          return false;
        }
      }
    },
    // This is the server owner.
    { level: 4,
      name: "Server Owner", 
      // Simple check, if the guild owner id matches the message author's ID, then it will return true.
      // Otherwise it will return false.
      check: (message) => message.channel.type === "text" ? (message.guild.owner.user.id === message.author.id ? true : false) : false
    },

    // Bot Support is a special inbetween level that has the equivalent of server owner access
    // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
    { level: 8,
      name: "Bot Support",
      // The check is by reading if an ID is part of this array. Yes, this means you need to
      // change this and reboot the bot to add a support user. Make it better yourself!
      check: (message) => config.support.includes(message.author.id)
    },

    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    { level: 9,
      name: "Bot Admin",
      check: (message) => config.admins.includes(message.author.id)
    },

    // This is the bot owner, this should be the highest permission level available.
    // The reason this should be the highest level is because of dangerous commands such as eval
    // or exec (if the owner has that).
    { level: 10,
      name: "Bot Owner", 
      // Another simple check, compares the message author id to the one stored in the config file.
      check: (message) => config.ownerID.includes(message.author.id)
    }
  ]
};

module.exports = config;