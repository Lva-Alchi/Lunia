const fs = require('fs');
const path = require('path');

// Caching
const locales = {};
const localesPath = path.join(__dirname, '../locales');

// Auto load JSON from 'src/locales'
function loadLocales() {
    const files = fs.readdirSync(localesPath).filter(file => file.endsWith('.json'));
    
    files.forEach(file => {
        const langCode = file.replace('.json', '');
        const content = fs.readFileSync(path.join(localesPath, file), 'utf8');
        locales[langCode] = JSON.parse(content);
    });
    console.log(`🌍 [i18n] Loaded ${files.length} language.`);
}

loadLocales();

function translate(langCode, key, params = {}) {
    // Helper function to resolve dot-notation paths (e.g., 'commands.ping.desc')
    const resolvePath = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Attempt to find the text in the requested language, fallback to 'id', then fallback to the key itself
    let text = resolvePath(locales[langCode], key) || resolvePath(locales['id'], key) || key;
    
    // Safety check: Ensure the resolved value is a string before attempting replacement
    if (typeof text !== 'string') {
        return key; 
    }
    
    // Replace variable {key} with real data
    for (const [pKey, pValue] of Object.entries(params)) {
        text = text.replace(new RegExp(`{${pKey}}`, 'g'), pValue);
    }
    
    return text;
}

module.exports = translate;
