const fs = require('fs').promises;
const path = require('path');

class JsonUserService {
    constructor() {
        // Menetapkan lokasi database di root project
        this.dbPath = path.join(process.cwd(), 'database.json');
    }

    /**
     * Membaca file JSON dan mengonversinya menjadi objek JavaScript
     * Jika file tidak ada, otomatis membuat file baru dengan struktur awal
     */
    async _readDB() {
        try {
            const data = await fs.readFile(this.dbPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                const initialDB = { users: [] };
                await this._writeDB(initialDB);
                return initialDB;
            }
            throw error;
        }
    }

    /**
     * Menyimpan objek JavaScript kembali ke file database.json
     */
    async _writeDB(data) {
        await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
    }

    /**
     * Mencari data user berdasarkan Telegram ID
     */
    async getUser(telegramId) {
        const db = await this._readDB();
        const user = db.users.find(u => u.telegramId === telegramId.toString());
        return user || null;
    }

    /**
     * Mendaftarkan user baru ke dalam database
     */
    async createUser(telegramId, username, language = 'id') {
        const db = await this._readDB();
        
        const newUser = {
            telegramId: telegramId.toString(),
            isBanned: false,
            username: username || 'Unknown',
            customId: `USER-${telegramId}`,
            limitQuota: 100,
            language: language,
            joinedAt: new Date().toISOString()
        };
        
        db.users.push(newUser);
        await this._writeDB(db);
        
        console.log(`[DB-JSON] User baru terdaftar: ${username}`);
        return newUser;
    }

    /**
     * Memperbarui data user yang sudah ada (merge data lama dengan data baru)
     */
    async updateUser(telegramId, updateData) {
        const db = await this._readDB();
        const index = db.users.findIndex(u => u.telegramId === telegramId.toString());
        
        if (index !== -1) {
            db.users[index] = { ...db.users[index], ...updateData };
            await this._writeDB(db);
            return db.users[index];
        }
        return null;
    }

    /**
     * Menghapus satu atau banyak user sekaligus berdasarkan array ID
     */
    async deleteUsers(telegramIds) {
        const db = await this._readDB();
        const idsToDelete = Array.isArray(telegramIds) ? telegramIds : [telegramIds.toString()];
        
        const initialCount = db.users.length;
        db.users = db.users.filter(u => !idsToDelete.includes(u.telegramId));
        
        await this._writeDB(db);
        return initialCount - db.users.length;
    }
}

// Mengekspor instance dari class agar bisa langsung digunakan (Singleton Pattern)
module.exports = new JsonUserService();