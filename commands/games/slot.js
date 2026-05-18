const userService = require('../../src/database/services/userService.js');
const t = require('../../src/utils/i18n');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const simbol = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];
const getRand = () => simbol[Math.floor(Math.random() * simbol.length)];

module.exports = {
    name: ['slot'],
    description: 'desc.slots',
    showInMenu: true,
    async execute(ctx) {
        const user = ctx.dbUser;

        if (user.limitQuota < 1) {
            return await ctx.reply(t(ctx.dbLang, 'insufficient'));
        }


        let currentQuota = user.limitQuota - 1;
        await userService.updateUser(user.telegramId, { limitQuota: currentQuota });


        const firstChat = await ctx.reply('🎰 *CASINO ROYALE* 🎰\n\nInserting coin...', { parse_mode: "Markdown"});

        // 3. RNG (Random Number Generator)
        const rng = Math.random();
        let hadiah = 0;
        
        if (rng < 0.50)      { hadiah = 0; }
        else if (rng < 0.75) { hadiah = 1; }
        else if (rng < 0.87) { hadiah = 2; }
        else if (rng < 0.94) { hadiah = 3; }
        else if (rng < 0.975){ hadiah = 4; }
        else if (rng < 0.990){ hadiah = 5; }
        else if (rng < 0.998){ hadiah = 6; }
        else                 { hadiah = 7; }


        const finalTop = [getRand(), getRand(), getRand()];
        const finalBot = [getRand(), getRand(), getRand()];
        let finalMid = []; //Payline

        if (hadiah === 0) {
            finalMid = [getRand(), getRand(), '💩'].sort(() => Math.random() - 0.5);
        } else {
            const simbolMenang = simbol[hadiah - 1];
            finalMid = [simbolMenang, simbolMenang, simbolMenang];
        }

        for (let frame = 0; frame <= 3; frame++) {
            let displayTop = [], displayMid = [], displayBot = [];

            for (let col = 0; col < 3; col++) {
                if (col < frame) {
                    displayTop.push(finalTop[col]);
                    displayMid.push(finalMid[col]);
                    displayBot.push(finalBot[col]);
                } else {
                    displayTop.push(frame === 0 ? '🔄' : getRand());
                    displayMid.push(frame === 0 ? '🔄' : getRand());
                    displayBot.push(frame === 0 ? '🔄' : getRand());
                }
            }

            let teksGrid = `🎰 **CASINO ROYAL** 🎰\n\n`;
            teksGrid += `| ${displayTop.join(' | ')} |\n`;
            teksGrid += `| ${displayMid.join(' | ')} | ⬅️ *PAYLINE*\n`;
            teksGrid += `| ${displayBot.join(' | ')} |\n\n`;
            
            if (frame < 3) {
                teksGrid += `*Rolling...*`;
            } else {
                teksGrid += `*Calculating Reward...*`;
            }

            await ctx.telegram.editMessageText(
                ctx.chat.id, 
                firstChat.message_id, 
                null, 
                teksGrid, 
                { parse_mode: 'Markdown' }
            );

            if (frame < 3) await delay(700);
        }

        if (hadiah > 0) {
            currentQuota += hadiah;
            await userService.updateUser(user.telegramId, { limitQuota: currentQuota });
        }

        let teksHasil = `🎰 **CASINO ROYAL** 🎰\n\n`;
        teksHasil += `| ${finalTop.join(' | ')} |\n`;
        teksHasil += `| ${finalMid.join(' | ')} | ⬅️ *PAYLINE*\n`;
        teksHasil += `| ${finalBot.join(' | ')} |\n\n`;

        if (hadiah === 7) {
            teksHasil += t(ctx.dbLang, 'games.slot.jackpot', { reward: hadiah});
        } else if (hadiah > 1) {
            teksHasil += t(ctx.dbLang, 'games.slot.bigWin', { reward: hadiah });
        } else if (hadiah === 1) {
            teksHasil += t(ctx.dbLang, 'games.slot.win', { reward: hadiah });
        } else {
            teksHasil += t(ctx.dbLang, 'games.slot.lose');
        }
        
        teksHasil += t(ctx.dbLang, 'remainingQuota',{ quota: currentQuota});

        await delay(500);
        await ctx.telegram.editMessageText(
            ctx.chat.id, 
            firstChat.message_id, 
            null, 
            teksHasil, 
            { parse_mode: 'Markdown' }
        );
    }
};