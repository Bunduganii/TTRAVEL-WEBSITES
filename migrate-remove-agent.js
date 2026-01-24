// One-time migration: remove agent/staff, keep customer + admin only.
// Run: node migrate-remove-agent.js

const mysql = require('mysql2/promise');

async function run() {
    const c = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '1234',
        database: 'travel_agency_db'
    });
    await c.execute("DELETE FROM users WHERE user_type IN ('agent','staff')");
    await c.execute("ALTER TABLE users MODIFY user_type ENUM('customer','admin') DEFAULT 'customer'");
    console.log('Migration done: agent/staff removed, user_type is customer|admin only.');
    await c.end();
}

run().catch(e => { console.error(e); process.exit(1); });
