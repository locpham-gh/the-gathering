import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    connectionString: 'postgresql://postgres:123@localhost:5432/the_gathering'
});

async function main() {
    try {
        await client.connect();
        console.log('Connected to DB');

        await client.query('TRUNCATE TABLE resources CASCADE;');
        console.log('Truncated resources table');

        console.log('Migration successful');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
