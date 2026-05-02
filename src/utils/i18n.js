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
    // if language is not exist, set to 'id'(default)
    let text = locales[langCode]?.[key] || locales['id']?.[key] || key;
    
    // Replace variable {key} with real data
    for (const [pKey, pValue] of Object.entries(params)) {
        text = text.replace(new RegExp(`{${pKey}}`, 'g'), pValue);
    }
    
    return text;
}

module.exports = translate;
