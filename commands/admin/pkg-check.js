const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const t = require('../../src/utils/i18n.js');

module.exports = {
    name: 'npq',
    description: 'desc.npq',
    showInMenu: true,
    async execute(ctx) {
        const adminIds = process.env.ADMIN_IDS.split(',');
        if (!adminIds.includes(ctx.from.id.toString())) return ctx.reply();

        const textParts = ctx.message.text.split(' ');
        const pkgName = textParts[1];

        if (!pkgName || !/^[a-zA-Z0-9\-_.@\/]+$/.test(pkgName)) {
            return ctx.reply(t(ctx.dbLang, 'wrong_format') + ' /npq <package>');
        }

        ctx.reply(t(ctx.dbLang, 'loading'), { parse_mode: 'Markdown' });

        try {
            const { stdout, stderr } = await execPromise(`echo n | npx npq ${pkgName}`);
            
            const fullLog = `${stdout}\n${stderr}`;
            
            ctx.reply(`🛡️ *NPQ (${pkgName}):*\n\n\`\`\`text\n${fullLog.substring(0, 3000)}\n\`\`\``, { parse_mode: 'Markdown' });
        } catch (error) {
            const errorLog = error.stdout || error.stderr || error.message;
            ctx.reply(`⚠️ *NPQ (Warning!):*\n\n\`\`\`text\n${errorLog.substring(0, 3000)}\n\`\`\``, { parse_mode: 'Markdown' });
        }
    }
};