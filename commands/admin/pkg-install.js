const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

module.exports = {
    name: 'install',
    description: 'desc.install',
    showInMenu: true,
    async execute(ctx) {
        const adminIds = process.env.ADMIN_IDS.split(',');
        const userId = ctx.from.id.toString();
        
        if (!adminIds.includes(userId)) {
            return ctx.reply(t(ctx.dbLang, 'access_denied'));
        }

        const textParts = ctx.message.text.trim().split(/\s+/);
        const packages = textParts.slice(1);

        if (packages.length === 0) {
            return ctx.reply(t(ctx.dbLang, 'wrong_command') + '`/install express cors dotenv`', { parse_mode: 'Markdown' });
        }

        const regex = /^[a-zA-Z0-9\-_.@\/]+$/;
        for (const pkg of packages) {
            if (!regex.test(pkg)) {
                return ctx.reply(`⚠️ "*${pkg}*" ` + t(ctx.dbLang, 'invalid'), { parse_mode: 'Markdown' });
            }
        }

        const pkgString = packages.join(' ');

        const msg = await ctx.reply(t(ctx.dbLang, 'loading') + `\n📥 *${pkgString}*`, { parse_mode: 'Markdown' });

        try {
            const { stdout, stderr } = await execPromise(`npm install ${pkgString}`);

            const outputLog = stdout ? stdout.substring(0, 1000) : ' ';
            
            ctx.reply(t(ctx.dbLang, 'success') + `\n\n*Package:* ${pkgString}\n\n*Log:*\n\`\`\`text\n${outputLog}\n\`\`\``, { parse_mode: 'Markdown' });
        } catch (error) {
            const errorLog = error.message.substring(0, 1000);
            ctx.reply(t(ctx.dbLang, 'error') + `\n\n*Error:*\n\`\`\`text\n${errorLog}\n\`\`\``, { parse_mode: 'Markdown' });
        }
    }
};