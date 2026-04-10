import Database from 'better-sqlite3';
import path from 'path';

const dataDir = process.env.DATA_DIR || process.cwd();
const dbPath = path.resolve(dataDir, 'leads.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    product_interest TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    contacted INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    desc TEXT NOT NULL,
    price TEXT,
    img_path TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS otps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mobile_number TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0
  );
`);

// Graceful Schema Migrations for v2 (Order Status & Email)
try {
  // Check if email column exists, if not, add it
  const columns = db.prepare("PRAGMA table_info(leads)").all();
  const hasEmail = columns.some(c => c.name === 'email');
  const hasStatus = columns.some(c => c.name === 'status');
  
  if (!hasEmail) {
    db.exec("ALTER TABLE leads ADD COLUMN email TEXT DEFAULT ''");
  }
  if (!hasStatus) {
    db.exec("ALTER TABLE leads ADD COLUMN status TEXT DEFAULT 'Requested'");
  }
} catch (e) {
  console.error("Migration error:", e);
}

// Seed initial products if table is empty
const productCount = db.prepare('SELECT count(*) as count FROM products').get();
if (productCount.count === 0) {
  const insertProduct = db.prepare('INSERT INTO products (id, name, desc, price, img_path) VALUES (?, ?, ?, ?, ?)');
  
  const initialProducts = [
    { id: 'coarse-sand', name: 'Coarse Sand', desc: 'Premium coarse river sand ideal for concrete mixing and heavy construction.', price: '₹1200 / Ton', img_path: '/sand-coarse.png' },
    { id: 'fine-sand', name: 'Fine Sand', desc: 'Superior fine sand for smooth plastering and finishing work.', price: '₹1100 / Ton', img_path: '/sand-fine.png' },
    { id: 'medium-sand', name: 'Medium Sand', desc: 'Versatile medium sand suitable for brickwork and masonry.', price: '₹1150 / Ton', img_path: '/sand-medium.png' },
    { id: 'karimnagar-bricks', name: 'Karimnagar Premium Bricks', desc: 'Top-quality red bricks sourced directly from Karimnagar. High strength guaranteed.', price: '₹9 / Brick', img_path: '/brick-karimnagar.png' },
    { id: 'local-bricks', name: 'Local Bricks', desc: 'Cost-effective local bricks for general construction needs.', price: '₹6 / Brick', img_path: '/brick-local.png' }
  ];

  initialProducts.forEach(p => {
    insertProduct.run(p.id, p.name, p.desc, p.price, p.img_path);
  });
}

export default db;
