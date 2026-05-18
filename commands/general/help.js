const t = require('../../src/utils/i18n.js');

module.exports = {
    name: 'help',
    description: 'desc.help',
    showInMenu: true,
    async execute(ctx) {
        const helpMessage = t(ctx.dbLang, 'helpMessage');
        ctx.replyWithMarkdown(helpMessage);
    }
};
