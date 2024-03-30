const bcrypt = require('bcrypt');
const Admin = require('../models/Admin'); 

async function createInitialAdmin() {
    try {
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (!existingAdmin) {
            const username = 'admin';
            const password = 'password';
            const hashedPassword = await bcrypt.hash(password, 10);
        
            const newAdmin = await Admin.create({
                username: username,
                password: hashedPassword
            });

            console.log('Başlangıç admini oluşturuldu.');
        } else {
            console.log('Başlangıç admini zaten var.');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
}

createInitialAdmin();
