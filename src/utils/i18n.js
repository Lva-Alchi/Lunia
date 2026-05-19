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
    
    const resolvePath = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    //fallback
    let text = resolvePath(locales[langCode], key) || resolvePath(locales['en'], key) || key;
    
    //validate data type
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
