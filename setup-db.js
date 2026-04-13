const { Client } = require('pg');

const regions = ['ap-south-1', 'ap-southeast-1', 'us-east-1', 'eu-central-1', 'ap-east-1', 'ap-northeast-1'];
const ref = 'krsoirbgpmtnqysnbmqx';
const pass = 'dYEko70WXDqaxm9B';

async function testRegions() {
  for (const region of regions) {
    const connStr = `postgres://postgres.${ref}:${pass}@aws-0-${region}.pooler.supabase.com:6543/postgres`;
    console.log(`Testing ${region}...`);
    const client = new Client({ connectionString: connStr, statement_timeout: 5000, connectionTimeoutMillis: 5000 });
    try {
      await client.connect();
      console.log(`SUCCESS! Connected exactly to ${region}`);
      
      const sql = `
CREATE TABLE IF NOT EXISTS leads (id SERIAL PRIMARY KEY, name TEXT NOT NULL, mobile_number TEXT NOT NULL, product_interest TEXT NOT NULL, timestamp TIMESTAMPTZ DEFAULT NOW(), contacted INTEGER DEFAULT 0, email TEXT DEFAULT '', status TEXT DEFAULT 'Requested');
CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT NOT NULL, "desc" TEXT NOT NULL, price TEXT, img_path TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS otps (id SERIAL PRIMARY KEY, mobile_number TEXT NOT NULL, otp_code TEXT NOT NULL, expires_at TIMESTAMPTZ NOT NULL, used INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS admin_settings (id SERIAL PRIMARY KEY, master_password TEXT NOT NULL);
INSERT INTO admin_settings (id, master_password) VALUES (1, 'admin123') ON CONFLICT DO NOTHING;
INSERT INTO products (id, name, "desc", price, img_path) VALUES 
('coarse-sand', 'Coarse Sand', 'Premium coarse river sand ideal for concrete mixing.', '₹1200 / Ton', '/sand-coarse.png'),
('fine-sand', 'Fine Sand', 'Superior fine sand for smooth plastering.', '₹1100 / Ton', '/sand-fine.png'),
('medium-sand', 'Medium Sand', 'Versatile medium sand suitable for brickwork.', '₹1150 / Ton', '/sand-medium.png'),
('karimnagar-bricks', 'Karimnagar Premium Bricks', 'Top-quality red bricks sourcing directly from Karimnagar.', '₹9 / Brick', '/brick-karimnagar.png'),
('local-bricks', 'Local Bricks', 'Cost-effective local bricks for general construction.', '₹6 / Brick', '/brick-local.png') 
ON CONFLICT DO NOTHING;
      `;
      await client.query(sql);
      console.log('Tables created successfully!');
      await client.end();
      return;
    } catch(e) {
      console.log(`Failed on ${region}: ${e.message}`);
    }
  }
}
testRegions();
