const userServices = require('../../src/database/services/userService.js');
const t = require('../../src/utils/i18n.js');

module.exports = {
  name: ['ban', 'unban'],
  description: 'desc.ban',
  showInMenu: true,
  async execute(ctx) {
    const adminIds = process.env.ADMIN_IDS.split(',');
    const userId = ctx.from.id.toString();
    
    if (!adminIds.includes(userId)) {
        return ctx.reply(t(ctx.dbLang, 'access_denied'));
    }

    const text = ctx.message.text;
    const args = text.split(/\s+/); 
    const command = args[0].toLowerCase(); 
    const targetIds = args.slice(1);
    
    if (command === '/ban') {
        if (targetIds.length === 0) {
            return ctx.reply(t(ctx.dbLang, 'wrong_format') + '`/ban <id1> <id2> ...`', { parse_mode: 'Markdown' });
        }

        let successCount = 0;
        for (const targetId of targetIds) {
            const banned = await userServices.updateUser(targetId, { isBanned: true });
            if (banned) successCount++;
        }
        return ctx.reply(t(ctx.dbLang, 'success') + ` ${successCount}/${targetIds.length} user.`);

    } 
    else if (command === '/unban') {
        if (targetIds.length === 0) {
            return ctx.reply(t(ctx.dbLang, 'wrong_format') + '`/unban <id1> <id2> ...`', { parse_mode: 'Markdown' });
        }

        let successCount = 0;
        for (const targetId of targetIds) {
            const unbanned = await userServices.updateUser(targetId, { isBanned: false });
            if (unbanned) successCount++;
        }
        return ctx.reply(t(ctx.dbLang, 'success') + `${successCount}/${targetIds.length} user.`);
    }
  }
};