module.exports = {
    // Function 1: Only SEARCH user data
    async getUser(telegramId) {
        try {
            const db = await readDB();
            const user = db.users.find(u => u.telegramId === telegramId.toString());
            return user || null; // return null if data not exist
        } catch (error) {
            console.error('Error JSON getUser:', error);
            throw error;
        }
    },

    // Function 2: Only to CREATE new user
    async createUser(telegramId, username, language = 'id') {
        try {
            const db = await readDB();
            
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
            await writeDB(db); // Save file to database.json
            
            console.log(`[DB-JSON] User baru terdaftar: ${username}`);
            return newUser;
        } catch (error) {
            console.error('Error JSON createUser:', error);
            throw error;
        }
    },
    
    // Function to delete user (Multi User supported)
    async deleteUsers(telegramIds) {
        try {
            const db = await readDB();
            // if input is (string), changed to array
            const idsToDelete = Array.isArray(telegramIds) ? telegramIds : [telegramIds.toString()];
            
            const initialCount = db.users.length;
            // Filter: Only save user if userID aren't in the list
            db.users = db.users.filter(u => !idsToDelete.includes(u.telegramId));
            
            await writeDB(db);
            return initialCount - db.users.length; // Return total users deleted
        } catch (error) {
            console.error('Error JSON deleteUsers:', error);
            throw error;
        }
    },

    
    async updateUser(telegramId, updateData) {
        try {
            const db = await readDB();
            const index = db.users.findIndex(u => u.telegramId === telegramId.toString());
            
            if (index !== -1) {
                // Merge old data with new data (updateData)
                db.users[index] = { ...db.users[index], ...updateData };
                await writeDB(db);
                return db.users[index];
            }
            return null;
        } catch (error) {
            console.error('Error JSON updateUser:', error);
            throw error;
        }
    }
};