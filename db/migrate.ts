import { db } from './index'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

const main = async () => {
    try {
        await migrate(db, {
            migrationsFolder: 'drizzle' // หรือ 'db/migrations' ถ้าคุณวางไว้ตรงนั้น
        })
        console.log("✅ Migration completed");
    } catch (error) {
        console.error("❌ Error during migration:", error);
        process.exit(1);
    }
}

main();
