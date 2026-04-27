import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../cafe.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS menu_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    category_id INTEGER,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    type TEXT NOT NULL,
    show INTEGER DEFAULT 1,
    images TEXT, -- JSON string array
    FOREIGN KEY (category_id) REFERENCES menu_categories(id)
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    visitors INTEGER DEFAULT 0,
    peak_time TEXT,
    watch_time REAL DEFAULT 0,
    UNIQUE(date)
  );

  CREATE TABLE IF NOT EXISTS visitor_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT,
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Function to initialize menu from YAML if DB is empty
export function initializeFromYaml() {
  const categoriesCount = db.prepare('SELECT COUNT(*) as count FROM menu_categories').get().count;
  if (categoriesCount === 0) {
    console.log('Initializing database from YAML files...');
    try {
      const menuPath = path.join(__dirname, '../src/config/menu.yaml');
      if (fs.existsSync(menuPath)) {
        const menuYaml = yaml.load(fs.readFileSync(menuPath, 'utf8'));
        
        const insertCategory = db.prepare('INSERT INTO menu_categories (name) VALUES (?)');
        const insertItem = db.prepare('INSERT INTO menu_items (id, category_id, name, price, type, show, images) VALUES (?, ?, ?, ?, ?, ?, ?)');

        for (const cat of menuYaml) {
          const result = insertCategory.run(cat.category);
          const categoryId = result.lastInsertRowid;

          for (const item of cat.items) {
            insertItem.run(
              item.id || `item-${Date.now()}-${Math.random()}`,
              categoryId,
              item.name,
              item.price,
              item.type,
              item.show ? 1 : 0,
              JSON.stringify(item.images || [])
            );
          }
        }
        console.log('Database initialized successfully.');
      }
    } catch (err) {
      console.error('Failed to initialize database from YAML:', err);
    }
  }
}

export default db;
