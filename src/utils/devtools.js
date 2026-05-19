const { exec } = require('node:child_process');
const util = require('node:util');
const t = require('./i18n');

const ADMIN_IDS = process.env.ADMIN_IDS 
    ? process.env.ADMIN_IDS.split(',').map(id => parseInt(id.trim())) 
    : [];

function setupDevTools(bot) {
    bot.on('message', async (ctx, next) => {
        const text = ctx.message?.text || '';

        const isDevTrigger = text.startsWith('$') || text.startsWith('>') || text.startsWith('=>');
        
        if (isDevTrigger) {
            if (!ADMIN_IDS.includes(ctx.from.id)) {
                return await ctx.reply('⛔ **Access Denied!**', { parse_mode: 'Markdown' });
            }
        } else {
            return next(); 
        }

        const msg = ctx.message;
        const reply = msg.reply_to_message; 
        const chat = ctx.chat;
        const user = ctx.from;

        // Execute Terminal/Bash ($)
        if (text.startsWith('$ ')) {
            const cmd = text.slice(2);
            exec(cmd, (error, stdout, stderr) => {
                let result = stdout || stderr;
                if (error) result = stderr || error.message;
                
                result = result.length > 4000 ? result.slice(0, 4000) + '\n...' : result;
                ctx.reply(`💻 **Terminal:**\n\`\`\`bash\n${result}\n\`\`\``, { parse_mode: 'Markdown' });
            });
            return;
        }

        // Evaluate JS - Single Line & Auto-Dump (>)
        if (text.startsWith('>')) {
            const code = text.slice(1).trim();

            // Auto-dump metadata 
            if (code === '' && reply) {
                let metadata = util.inspect(reply, { depth: null });
                metadata = metadata.length > 4000 ? metadata.slice(0, 4000) + '\n...' : metadata;
                return await ctx.reply(`📦 **Metadata Reply:**\n\`\`\`javascript\n${metadata}\n\`\`\``, { parse_mode: 'Markdown' });
            }

            if (code === '') return; 

            try {
                let evaled = await eval(code);
                
                if (typeof evaled !== 'string') evaled = util.inspect(evaled, { depth: 1 });
                evaled = evaled.length > 4000 ? evaled.slice(0, 4000) + '\n...' : evaled;

                await ctx.reply(`🔍 **Eval:**\n\`\`\`javascript\n${evaled}\n\`\`\``, { parse_mode: 'Markdown' });
            } catch (err) {
                await ctx.reply(`❌ **Error:**\n\`\`\`javascript\n${err.message}\n\`\`\``, { parse_mode: 'Markdown' });
            }
            return;
        }

        // Evaluate JS - Async Block (=>)
        if (text.startsWith('=> ')) {
            const code = text.slice(3);
            try {
                let evaled = await eval(`(async () => { ${code} })()`);
                
                if (evaled !== undefined) {
                    if (typeof evaled !== 'string') evaled = util.inspect(evaled, { depth: 1 });
                    evaled = evaled.length > 4000 ? evaled.slice(0, 4000) + '\n...' : evaled;
                    await ctx.reply(`⚙️ **Async Eval:**\n\`\`\`javascript\n${evaled}\n\`\`\``, { parse_mode: 'Markdown' });
                }
            } catch (err) {
                await ctx.reply(`❌ **Error:**\n\`\`\`javascript\n${err.message}\n\`\`\``, { parse_mode: 'Markdown' });
            }
            return;
        }
    });
}

module.exports = setupDevTools;