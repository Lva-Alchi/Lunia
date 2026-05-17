const userService = require('../../src/database/services/userService.js');
const t = require('../../src/utils/i18n.js');

module.exports = {
    name: 'setlimit',
    description: 'desc.setlimit',
    showInMenu: true,
    async execute(ctx) {
        const adminIds = process.env.ADMIN_IDS.split(',');
        if (!adminIds.includes(ctx.from.id.toString())) return ctx.reply(t(ctx.dbLang, 'access_denied'));

        const args = ctx.message.text.split(' ');
        const targetId = args[1];
        const newLimit = parseInt(args[2]);

        if (!targetId || isNaN(newLimit)) {
            return ctx.reply(t(ctx.dbLang, 'wrong_format') + `/setlimit <USER_ID> <AMOUNT>`, { parse_mode: 'Markdown' });
        }

        const updated = await userService.updateUser(targetId, { limitQuota: newLimit });

        if (updated) {
            ctx.reply(t(ctx.dbLang, 'success:setlimit', { amount: updated.limitQuota }), { parse_mode: 'Markdown' });
        } else {
            ctx.reply(t(ctx.dbLang, 'user:notfound'));
        }
    }
};