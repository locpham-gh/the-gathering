import bcrypt from "bcryptjs";
import db from "../config/db.js";

async function forceUpdateUser() {
  const email = "user@gmail.com";
  const username = "user_test";
  const rawPassword = "user123";

  try {
    console.log(`Hashing password for ${email}...`);
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);

    // Check if user exists by email
    const result = await db.query(
      "UPDATE users SET password_hash = $1, username = $2 WHERE email = $3 RETURNING *",
      [hash, username, email],
    );

    if (result.rowCount === 0) {
      console.log(`User with email '${email}' not found, inserting...`);
      await db.query(
        "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, 'user')",
        [username, email, hash],
      );
      console.log(`✅ User '${email}' created successfully.`);
    } else {
      console.log(`✅ User '${email}' updated successfully.`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating/creating user:", err);
    process.exit(1);
  }
}

forceUpdateUser();
