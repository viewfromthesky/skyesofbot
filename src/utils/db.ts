import DatabaseConstructor, { Database } from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import allMigrations from '../migrations/migrations.json';

const dbName = process.env.DB_NAME || 'skyesofbot';

interface Migration {
	up: string;
	down?: string;
}

export async function testFunc() {
	const db = new DatabaseConstructor(`${dbName}.db`);

	db.close();
}

export function runMigrations() {
	const db = new DatabaseConstructor(`${dbName}.db`);

	// Create the migrations table if it doesn't exist
	const createMigrationsTable = db.prepare('CREATE TABLE IF NOT EXISTS migrations (migration_id varchar(36) PRIMARY KEY, dateRan datetime DEFAULT CURRENT_TIMESTAMP)');

	createMigrationsTable.run();

	migrate(db, allMigrations);

	db.close();
}

function migrate(db: Database, migrations: Record<string, Migration>) {
	Object.keys(migrations).forEach((migrationId) => {
		const migrationPreviouslyRun = db.prepare('SELECT 1 FROM migrations WHERE migration_id = ?').get(migrationId);

		if(!migrationPreviouslyRun) {
			const migrationFile = fs.readFileSync(`${path.dirname(require.main?.filename as string)}/migrations/sql/${migrations[migrationId].up}.sql`, 'utf8');

			db.exec(migrationFile);

			db.prepare('INSERT INTO migrations (migration_id) VALUES (?)').run(migrationId);
		}
	})
}
