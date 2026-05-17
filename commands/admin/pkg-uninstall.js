const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const t = require('../../src/utils/i18n');

module.exports = {
    name: 'uninstall',
    description: 'desc.uninstall',
    showInMenu: true,
    async execute(ctx) {
        const adminIds = process.env.ADMIN_IDS.split(',');
        if (!adminIds.includes(ctx.from.id.toString())) return ctx.reply(t(ctx.dbLang, 'access_denied'));

        const textParts = ctx.message.text.split(' ');
        const pkgName = textParts[1];

        if (!pkgName || !/^[a-zA-Z0-9\-_.@\/]+$/.test(pkgName)) {
            return ctx.reply(t(ctx.dbLang, 'wrong_format') + '/uninstall <package>', { parse_mode : "Markdown"});
        }

        const msg = await ctx.reply(t(ctx.dbLang, 'loading'), + `📤 *${pkgName}*`, { parse_mode: 'Markdown' });

        try {
            const { stdout } = await execPromise(`npm uninstall ${pkgName}`);
            ctx.reply(t(ctx.dbLang, 'success') + `\n\n*Log:*\n\`\`\`text\n${stdout.substring(0, 1000)}\n\`\`\``, { parse_mode: 'Markdown' });
        } catch (error) {
            ctx.reply(t(ctx.dbLang, 'error') + `\n\n*Error:*\n\`\`\`text\n${error.message.substring(0, 1000)}\n\`\`\``, { parse_mode: 'Markdown' });
        }
    }
};