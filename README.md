# 🤖 Base Telegram Bot Framework

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Framework](https://img.shields.io/badge/framework-Telegraf.js-blue)](https://telegraf.js.org/)
[![Database](https://img.shields.io/badge/database-JSON%20%7C%20MongoDB-orange)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-red)](LICENSE)

A robust, production-ready Telegram Bot boilerplate built with **Telegraf.js**. This project features a modular architecture, advanced developer tools, and flexible database support (JSON/MongoDB) optimized for performance and scalability.

---

## 🚀 Core Features

* **🛡️ Advanced Developer Tools**: Integrated `eval`, `exec`, and `async eval` commands with strict administrator-only access via environment variables.
* **📊 Modular Database Services**: Singleton-patterned CRUD operations supporting both local **JSON** storage and **MongoDB** (via Mongoose).
* **🖼️ High-Quality QR Generator**: Professional QR code generation utilizing `qr-creator` and `canvas` with custom radius and styling.
* **📁 Error Management**: Automated logging system for system-level fatal errors and user-level runtime exceptions.
* **⚙️ Production Optimized**: Includes graceful shutdown protocols and Nodemon configuration to prevent restart loops during database writes.

---

## 🛠️ Project Structure

```text
.
├── commands/           # Bot command handlers
│   └── tools/          # Tool-related commands (e.g., QR Gen)
├── lib/
│   ├── utils/          # Utility functions (Logger, DevTools)
│   └── services/       # Database CRUD services (JSON/Mongo)
├── .env                # Environment configuration
├── .gitignore          # Files to be ignored by Git
├── database.json       # Local storage (Auto-generated)
├── index.js            # Main entry point
└── package.json        # Dependencies and scripts

```

---

## 📦 Installation

### Prerequisites

* **Node.js** v16.0.0 or higher
* **NPM** or **Yarn**

### Setup

1. **Clone the repository:**
```bash
git clone [https://github.com/Lva-Alchi/base-telegram-bot.git](https://github.com/Lva-Alchi/base-telegram-bot.git)
cd base-telegram-bot

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
Create a `.env` file in the root directory:
```env
BOT_TOKEN=your_telegram_bot_token
ADMIN_IDS=12345678,87654321
MONGO_URI=your_mongodb_connection_string

```



---

## 🖥️ Usage

### Development Mode

Runs the bot with `nodemon`, automatically ignoring database changes to prevent restart loops:

```bash
npm run dev

```

### Production Mode

Standard execution for stable environments:

```bash
npm start

```

---

## 🔧 Developer Commands

Accessible only to IDs defined in the `ADMIN_IDS` environment variable.

| Trigger | Description | Example |
| --- | --- | --- |
| `$` | Execute terminal/shell commands | `$ npm install` |
| `>` | Evaluate single-line JavaScript | `> ctx.me` |
| `=>` | Evaluate multi-line Async JS | `=> await ctx.reply('Hi')` |
| `>` (Reply) | Dump message metadata | *Reply to any msg with `>*` |

---

## 🛡️ Graceful Shutdown

The application listens for `SIGINT` and `SIGTERM` signals. This ensures the bot disconnects from the Telegram API properly before the Node.js process terminates, preventing **409 Conflict** errors upon the next startup.

---

## 🤝 Support & Donation

If this boilerplate accelerated your development workflow, consider supporting the project. Your contributions help maintain the repository and fund future feature development.

* **💰 Digital Wallets**: [Insert Dana/Ovo/Gopay/PayPal Link]
* **☕ Buy Me a Coffee**: [Insert Ko-fi/Trakteer/Patreon Link]

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

```

```
