//©ALCHI
process.on('uncaughtException', (err) => {
    logSystemError(err);
    process.exit(1); 
});
process.on('unhandledRejection', (reason) => {
    const err = reason instanceof Error ? reason : new Error(String(reason));
    logSystemError(err);
});

require('dotenv').config();
const userService = require('./src/database/services/userService');
const { connectDB } = require('./src/database/connection');
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');
const { logSystemError, logUserError } = require('./src/utils/logger');
const setupDevTools = require('./src/utils/devtools');
const t = require('./src/utils/i18n');
const { getAvailableLanguage } = require('./src/lib/function');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);

// 1. MIDDLEWARE
// =======================================
bot.use(async (ctx, next) => {
    if (!ctx.from) return next();

    const userId = ctx.from.id;
    const tks = ctx.message?.text || '';
    const callbackData = ctx.callbackQuery?.data || '';
    
    //defined user language
    const available = getAvailableLanguage();
    const rawLang = ctx.from.language_code || 'en';
    let userLang = rawLang.substring(0, 2).toLowerCase();
    const isAvailable = available.some(lang => lang.code === userLang);
    if (!isAvailable) { userLang = 'en' };
    
    const userData = await userService.getUser(userId); //get data by userId
    
    //Block Banned user
    if (userData && userData.isBanned) {
        const pesanBanned = t(ctx.dbLang, 'banned');
        
        if (ctx.message) return await ctx.reply(pesanBanned, { parse_mode: 'Markdown' });
        if (ctx.callbackQuery) return await ctx.answerCbQuery(t(ctx.dbLang, 'is_banned'), { show_alert: true });
        
        return;
    }
    
    // WhiteList
    if (tks.startsWith('/start') || tks.startsWith('/login') || callbackData === 'btn_login') {
        ctx.dbUser = await userService.getUser(userId);
        return next();
    }

    if (!userData) {
        const pesanTolak = t(ctx.from.language_code, 'signFirst');
        const tombolMulai = {
            reply_markup: {
                inline_keyboard: [[ { text: '🚀 Login / Sign-Up', callback_data: 'btn_login' } ]]
            },
            parse_mode: 'Markdown'
        };

        if (ctx.message) return await ctx.reply(pesanTolak, tombolMulai);
        if (ctx.callbackQuery) return await ctx.answerCbQuery(t(ctx.from.language_code, 'signFirst'), { show_alert: true });
        return;
    }

    // Caching
    ctx.dbUser = userData;
    ctx.dbLang = userData.language;
    return next();
});

// 2. AUTO-LOAD COMMANDS
// ======================================
bot.commandsList = new Map(); 
bot.context.commandsList = bot.commandsList;

const commandsPath = path.join(__dirname, 'commands');

// For 'Category Style' displayed to users
const categoryStyles = {
    'general': '🌐 𝐆𝐄𝐍𝐄𝐑𝐀𝐋 🌐',
    'admin': '🛡 𝐀𝐃𝐌𝐈𝐍𝐒 ',
    'user': '👤 𝐔𝐒𝐄𝐑',
    'games': '🎮 𝐆𝐀𝐌𝐄𝐒'
    //etc...
};


// Sub-Folder Reader (Recursive)
function readAllCommandFiles(dir) {
    let files = [];
    
    if (!fs.existsSync(dir)) {
        console.log(`[ERROR] Folder not found: ${dir}`);
        return files;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            console.log(`[SCAN] Scanning Sub-Folder: ${item}/`);
            files = files.concat(readAllCommandFiles(fullPath));
        } else if (item.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    return files;
}

// Command Folder scan
console.log('\n--- 📂 STARTING COMMANDS SCAN ---');
const commandFiles = readAllCommandFiles(commandsPath);

for (const filePath of commandFiles) {
    try {
        const command = require(filePath);
        
        if (command.name && command.execute) {
            const folderName = path.basename(path.dirname(filePath));
            
            // Auto-Categorize
            if (!command.category && folderName !== 'commands') {
                command.category = categoryStyles[folderName] || folderName;
            }

            const commandNames = Array.isArray(command.name) ? command.name : [command.name];
            
            for (const name of commandNames) {
                bot.commandsList.set(name, command); 
                
                bot.command(name, async (ctx) => {
                    try {
                        await command.execute(ctx);
                    } catch (error) {
                        console.error(`Error while executing /${name}:`, error);
                        await ctx.reply(t(ctx.from.language_code, 'InternalError'));
                    }
                });
                console.log(`✅ Loaded: /${name} (Category: ${command.category || '📦 Other'})`);
            }
        } else {
            console.log(`⚠️ Skipped: ${path.basename(filePath)} (Invalid Format)`);
        }
    } catch (err) {
        console.error(`❌ Failed to load: ${filePath}\nError:`, err.message);
        logUserError(err, ctx);
        ctx.reply(t(ctx.from.language_code, 'InternalError')).catch(() => {});
    }
}
console.log('--------------------------------\n');

// 3. BUTTON INTERACTION 
// ======================================
bot.action('btn_login', async (ctx) => {
    await ctx.answerCbQuery();
    const startCommand = bot.commandsList.get('login');
    if (startCommand) {
        ctx.message = { text: '/login' }; 
        await startCommand.execute(ctx);
    } else {
        await ctx.reply('Click this: /login');
    }
});

bot.hears('👤 Profile', async (ctx) => {
    const profilCommand = bot.commandsList.get('profil');
    if (profilCommand) await profilCommand.execute(ctx);
});

bot.hears('💳 Quota', async (ctx) => {
    await ctx.reply(t(ctx.dbLang, 'remainingQuota', {quota: ctx.dbUser.limitQuota}), { parse_mode: 'Markdown' });
});

bot.hears('❌ Close', async (ctx) => {
    await ctx.reply('🛑 Menu Closed', Markup.removeKeyboard());
});

bot.action('action_lang_en', async (ctx) => {
    await ctx.answerCbQuery(); 
    await userService.updateUser(ctx.from.id, { language: 'en' });
    await ctx.editMessageText('✅ Language successfully changed to English!');
});

bot.action('action_lang_id', async (ctx) => {
    await ctx.answerCbQuery(); 
    await userService.updateUser(ctx.from.id, { language: 'id' });
    await ctx.editMessageText('✅ Bahasa berhasil diubah ke Indonesia!');
});

bot.action('action_tutup', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
});

// 4. START THE BOT
// ======================================
setupDevTools(bot);
connectDB();
bot.catch((err, ctx) => {
    console.error(`[TELEGRAF ERROR]`, err);
    logUserError(err, ctx);
    ctx.reply(t(ctx.from.language_code, 'InternalError')).catch(() => {});
});
bot.launch().then(() => {
    console.log(`\n🤖 Running...`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));