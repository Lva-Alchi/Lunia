const { Markup } = require('telegraf');
const t = require('../../src/utils/i18n');
const { fontStyle } = require('../../src/lib/function');

module.exports = {
    name: 'menu',
    description: 'desc.menu',
    showInMenu: true,
    async execute(ctx) {
      const unique = new Set(ctx.commandsList.values()); //avoid duplication
      const categories = {};
      
      for (const cmd of unique) {
            if (cmd.showInMenu === false) continue;
            const categoryName = cmd.category || '📦 Others';
            if (!categories[categoryName]) {
                categories[categoryName] = [];
            }
            let cmdNames = Array.isArray(cmd.name) 
                ? cmd.name.map(n => `/${n}`).join(', ') 
                : `/${cmd.name}`;
            const cmdDesc = t(ctx.dbLang, cmd.description) || ' ';

            categories[categoryName].push({ names: cmdNames, desc: cmdDesc });
        }
        
      const raw = t(ctx.dbLang, 'listmenu');
      const styled = fontStyle(raw, 'serifBold');
      let menuText = `༺ ` + styled + ` ༻\n\n`;

      for (const [category, commands] of Object.entries(categories)) {
          menuText += `┏━━─> ${category}\n`;
          for (const cmd of commands) {
                menuText += `┠> ${cmd.names} - ${cmd.desc}\n`;
            }
          menuText += `\n`;
        };

      // Reply Keyboard (Menu Bawah)
      /*const keyboard = Markup.keyboard([
          ['👤 Profile', '💳 limit'], // row 1
          ['❌ Close ']  //row 2
        ]).resize(); // Auto resize to match the device*/

      await ctx.replyWithMarkdown(menuText/*, keyboard*/);
    }
};