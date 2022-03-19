import DatabaseConstructor, { Database } from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { migrations as allMigrations, Migration } from '../migrations/migrations';

const dbName = process.env.DB_NAME || 'skyesofbot';

export function openDbConnection(): Database {
	return new DatabaseConstructor(`${dbName}.db`);
}

export function runMigrations(): void {
	const db = openDbConnection();

	// Create the migrations table if it doesn't exist
	const createMigrationsTable = db.prepare('CREATE TABLE IF NOT EXISTS migrations (migration_id varchar(36) PRIMARY KEY, dateRan datetime DEFAULT CURRENT_TIMESTAMP)');

	createMigrationsTable.run();

	migrate(db, allMigrations);

	db.close();
}

function migrate(db: Database, migrations: Record<string, Migration>): void {
	Object.keys(migrations).forEach((migrationId) => {
		const migrationPreviouslyRun = db.prepare('SELECT 1 FROM migrations WHERE migration_id = ?').get(migrationId);

		if(!migrationPreviouslyRun) {
			const migration = migrations[migrationId];

			console.log(`Migration "${migration.name}" has not been run`);
			const migrationFile = fs.readFileSync(`${path.dirname(require.main?.filename as string)}/migrations/sql/${migrations[migrationId].up}.sql`, 'utf8');

			db.exec(migrationFile);

			db.prepare('INSERT INTO migrations (migration_id) VALUES (?)').run(migrationId);
		}
	})
}
