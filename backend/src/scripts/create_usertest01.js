import bcrypt from "bcryptjs";
import db from "../config/db.js";

async function createTestUser() {
    const email = "usertest01@example.com";
    const username = "usertest01";
    const rawPassword = "usertest";

    try {
        console.log(`Checking if user ${username} exists...`);

        // Check if user exists by username or email
        const checkResult = await db.query(
            "SELECT * FROM users WHERE username = $1 OR email = $2",
            [username, email]
        );

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(rawPassword, salt);

        if (checkResult.rowCount === 0) {
            console.log(`User '${username}' not found, inserting...`);
            await db.query(
                "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, 'user')",
                [username, email, hash]
            );
            console.log(`✅ User '${username}' created successfully.`);
        } else {
            console.log(`User '${username}' or email already exists. Updating password...`);
            await db.query(
                "UPDATE users SET password_hash = $1 WHERE username = $2 OR email = $3",
                [hash, username, email]
            );
            console.log(`✅ User '${username}' password updated successfully.`);
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Error creating user:", err);
        process.exit(1);
    }
}

createTestUser();
