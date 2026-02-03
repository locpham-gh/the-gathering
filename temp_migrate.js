import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/the_gathering'
});

async function main() {
    try {
        await client.connect();
        console.log('Connected to DB');

        await client.query('ALTER TABLE messages ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES messages(id) ON DELETE SET NULL;');
        console.log('Added parent_id column');

        await client.query('CREATE INDEX IF NOT EXISTS idx_messages_parent_id ON messages(parent_id);');
        console.log('Created index');

        console.log('Migration successful');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
