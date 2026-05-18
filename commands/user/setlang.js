const userService = require('../../src/database/services/userService');
const t = require('../../src/utils/i18n.js');

module.exports = {
    name: 'setlang',
    description: 'desc.setlang',
    showInMenu: true,
    async execute(ctx) {
        const userId = ctx.from.id;
        const args = ctx.message.text.split(' ');
        const newLang = args[1]?.toLowerCase();
        
        //list of available language
        const available = [
          {code: 'id', name: 'Indonesia'}, 
          {code: 'en', name: 'English'}
          ];
        
        const langText = available.map(lang => `${lang.name} (${lang.code})`).join(', ')
            
        const isAvailable = available.some(lang => lang.code === newLang);
        
        // Valiate input
        if (!newLang || !isAvailable) {
            return ctx.reply(t(ctx.dbLang, 'unavailable') + `\n\n*📃 List :*\n${langText}`, { parse_mode: 'Markdown' });
        };

        // Update Database
        const updatedUser = await userService.updateUser(userId, { language: newLang });
        
        //try caching
        try {
          ctx.dbLang = updatedUser.language
        } catch (err) {
          ctx.reply(t(ctx.dbLang, 'InternalError'));
          console.log('[Ei18n]: ' + err)
        };

        if (updatedUser) {
            const msg = t(ctx.dbLang, 'lang_changed');
            ctx.reply(msg);
        } else {
          const userLangCode = ctx.from.language_code?.toLowerCase();
          const isCodeAvailable = available.some(lang => lang.code === userLangCode);
          
        //if user lang is unavailable, set default to 'en'
          if ( userLangCode && isCodeAvailable ) {
            ctx.reply(t(userLangCode, 'access_denied'));
          } else {
            ctx.reply(t('en', 'access_denied'));
          }
        }
    }
};