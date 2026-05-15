<div align="center">
  <img src="https://athars.space/uploads/726b6a48.png" width=80% height=80%> 
</div>

# 🤖 LUNIA - Chatbot Template 🌙

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Framework](https://img.shields.io/badge/framework-Telegraf.js-blue)](https://telegraf.js.org/)
[![Database](https://img.shields.io/badge/database-JSON%20%7C%20MongoDB-orange)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-Apache%202.0-red.svg?style=flat)](https://github.com/Lva-Alchi/base-telegram-bot/blob/main/LICENSE)

A robust, production-ready Telegram Bot boilerplate built with **Telegraf.js**. This project features a modular architecture, advanced developer tools, and flexible database support (JSON/MongoDB) optimized for performance and scalability.

---

## 🚀 Core Features

* **📊 Modular Database Services**: Singleton-patterned CRUD operations supporting both local **JSON** storage and **MongoDB** (via Mongoose).
* **📁 Error Management**: Automated logging system for system-level fatal errors and user-level runtime exceptions.
* **⚙️ Production Optimized**: Includes graceful shutdown protocols and Nodemon configuration to prevent restart loops during database writes.

## 🚀 Additional Features 

* **🛡️ Advanced Developer Tools**: Integrated `eval`, `exec`, and `async eval` commands with strict administrator-only access via environment variables.
* **🗂️ Auto Detection Commands**: Automatically scans and loads command files from directories, removing the need for manual imports.
* **🌐 Automatic Translation**: Translates text in real-time to provide seamless multi-language support.
* **📑 Dynamic Command Menu**: Auto-generates a categorized help menu based on folder structure, featuring customizable headers.


---

## 🛠️ Project Structure

```text
.
├── commands           # Bot command handlers
│   ├── admin           
│   ├── games           
│   ├── general         
│   └── user            
├── logs               # System logs (Errors, etc)
│   └── A               
├── src                 # Core application code
│   ├── database        # DB models and services
│   ├── lib             # Core libraries and wrappers
│   ├── locales         # Language translation files
│   └── utils           # Helper functions
├── .gitignore          
├── index.js            # Main entry point
├── LICENSE             
├── nodemon.json        # Nodemon configuration
├── package-lock.json   # Locked dependencies tree
├── package.json        # Project metadata and scripts
├── README.md           # Project documentation
└── sample.env          # Environment variables template
```

---

## 📦 Installation

### Prerequisites

* **Node.js** v16.0.0 or higher
* **NPM** or **Yarn**

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/Lva-Alchi/base-telegram-bot.git
cd base-telegram-bot

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
<br/>Create a `.env` file in the root directory:
```env
TELEGRAM_BOT_TOKEN=<your_token>
ADMIN_IDS=<admin_accounts_id>

# DB Engine : 'local' or 'mongodb'(cloud)
DB_ENGINE=local
# Paste Mongo URI here if using cloud (leave empty if using 'local')
MONGODB_URI=
```
  or copy and edit the `sample.env` file:
```env
cp sample.env .env
nano .env
```


---

## 🖥️ Run

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
| `>` (Reply) | Dump message metadata | *Reply to any msg with `>`* |

---

## 🛡️ Graceful Shutdown

The application listens for `SIGINT` and `SIGTERM` signals. This ensures the bot disconnects from the Telegram API properly before the Node.js process terminates, preventing **409 Conflict** errors upon the next startup.

---

## 📝 License

This project is licensed under the APACHE 2.0 License - see the [LICENSE](https://github.com/Lva-Alchi/base-telegram-bot/blob/main/LICENSE) file for details.

---

## 🤝 Support & Donation

If this boilerplate accelerated your development workflow, consider supporting the project. Your contributions help maintain the repository and fund future feature development.

* **💰 Trakteer**: [link](https://trakteer.id/alchiwak/gift)
* **☕ Buy Me a Coffee**: [here](https://ko-fi.com/alchi)
