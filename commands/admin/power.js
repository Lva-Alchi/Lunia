const t = require('../../src/utils/i18n');

module.exports = {
    name: ['stop', 'restart'],
    description: 'desc.power',
    showInMenu: true,
    async execute(ctx) {
        const adminIds = process.env.ADMIN_IDS.split(',');
        const userId = ctx.from.id.toString();

        if (!adminIds.includes(userId)) {
            return ctx.reply();
        }

        const text = ctx.message.text.toLowerCase();

        if (text.startsWith('/stop')) {
            await ctx.reply(t(ctx.dbLang, 'bot_stop') ,{ parse_mode: 'Markdown' });
            
            setTimeout(() => {
                console.log('🛑 Bot Stopped ...');
                process.exit(0);
            }, 1000);
        } 
        else if (text.startsWith('/restart')) {
            await ctx.reply(t(ctx.dbLang, 'bot_restart'), { parse_mode: 'Markdown' });
            
            setTimeout(() => {
                console.log('🔄 Bot Manually restarted...');
                process.exit(1); 
            }, 1000);
        }
    }
};