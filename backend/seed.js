const { sequelize } = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync();

        const email = 'admin@example.com';
        const password = 'adminpassword';
        const secretKey = 'adminsecret';

        // Check if admin exists
        const exists = await User.findOne({ where: { email } });
        if (exists) {
            console.log('Admin user already exists!');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const secretKeyHash = await bcrypt.hash(secretKey, salt);

        await User.create({
            name: 'Super Admin',
            email,
            passwordHash,
            secretKeyHash,
            role: 'admin'
        });

        console.log('---------------------------------');
        console.log('ADMIN CREATED SUCCESSFULLY');
        console.log('Email:      ' + email);
        console.log('Password:   ' + password);
        console.log('Secret Key: ' + secretKey);
        console.log('---------------------------------');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
