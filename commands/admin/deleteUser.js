const userServices = require('../../src/database/services/userService.js');
const t = require('../../src/utils/i18n.js');

module.exports = {
  name: 'delUser',
  description: 'desc.delUser',
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
    
    if (targetIds.length === 0) {
      return ctx.reply(t(ctx.dbLang, 'wrong_format') + '`/delUser <id1> <id2> ...`', { parse_mode: 'Markdown' });
        }
    let successCount = 0;
    for (const targetId of targetIds) {
      const deleted = await userServices.deleteUsers(targetId);
      if (deleted) successCount++;
        }
    if (successCount > 0) {
      return ctx.reply(t(ctx.dbLang, 'success') + ` *${successCount}/${targetIds.length}* 🗑️`, { parse_mode: "Markdown" });
    } else {
      return ctx.reply(t(ctx.dbLang, 'user:notfound'))
    }
  }
};