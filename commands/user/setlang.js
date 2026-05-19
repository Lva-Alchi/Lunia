const userService = require('../../src/database/services/userService');
const t = require('../../src/utils/i18n.js');
const { getAvailableLanguage } = require('../../src/lib/function');

module.exports = {
    name: 'setlang',
    description: 'desc.setlang',
    showInMenu: true,
    async execute(ctx) {
        const userId = ctx.from.id;
        
        // Prevent crash on empty text
        const args = (ctx.message?.text || '').split(' ');
        const newLang = args[1]?.toLowerCase();
        
        // Get available languages
        const available = getAvailableLanguage();
        
        const langText = available.map(lang => `${lang.name} (${lang.code})`).join(', ');
        const isAvailable = available.some(lang => lang.code === newLang);
        
        // Validate input
        if (!newLang || !isAvailable) {
            return ctx.reply(t(ctx.dbLang, 'unavailable') + `\n\n*📃 List :*\n${langText}`, { parse_mode: 'Markdown' });
        }

        // Update database
        const updatedUser = await userService.updateUser(userId, { language: newLang });

        // Check if update succeeded
        if (updatedUser) {
            // Safely update context cache
            try {
                ctx.dbLang = updatedUser.language;
            } catch (err) {
                console.log('[Ei18n]: ' + err);
                return ctx.reply(t(ctx.dbLang, 'internalError')); 
            }

            const msg = t(ctx.dbLang, 'lang_changed');
            return ctx.reply(msg);
            
        } else {
            // Handle db failure or unregistered user
            const userLangCode = ctx.from.language_code?.toLowerCase();
            const isCodeAvailable = available.some(lang => lang.code === userLangCode);
            
            // Fallback to user's system lang or English
            if (userLangCode && isCodeAvailable) {
                return ctx.reply(t(userLangCode, 'access_denied'));
            } else {
                return ctx.reply(t('en', 'access_denied'));
            }
        }
    }
};