// commands/profil.js
const { Markup } = require('telegraf');

module.exports = {
    name: 'profile',
    description: 'desc.profile',
    showInMenu: true,
    async execute(ctx) {
        const user = ctx.dbUser;
        const pesan = `👤 **USER PROFILE**\n\n` +
                      `🆔 System ID: \`${user.customId}\`\n` +
                      `🗣 Language : *${user.language.toUpperCase()}*\n` +
                      `🔋 Quota: *${user.limitQuota}*`;

        const inlineKeyboard = Markup.inlineKeyboard([
            // Row 1: change language
            [
                Markup.button.callback('🇺🇸 English', 'action_lang_en'), 
                Markup.button.callback('🇮🇩 Indonesia', 'action_lang_id')
            ],
            // Row 2 : close (delete chat)
            [
                Markup.button.callback('❌  Close', 'action_tutup')
            ]
        ]);

        await ctx.replyWithMarkdown(pesan, inlineKeyboard);
    }
};