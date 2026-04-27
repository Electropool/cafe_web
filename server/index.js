import express from 'express';
import cors from 'cors';
import db, { initializeFromYaml } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DB from YAML on startup
initializeFromYaml();

// --- MENU API ---

// Get all menu data
app.get('/api/menu', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM menu_categories').all();
    const data = categories.map(cat => {
      const items = db.prepare('SELECT * FROM menu_items WHERE category_id = ?').all(cat.id);
      return {
        category: cat.name,
        items: items.map(item => ({
          ...item,
          show: !!item.show,
          images: JSON.parse(item.images || '[]')
        }))
      };
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update or Add Item
app.post('/api/menu/item', (req, res) => {
  const { category, item } = req.body;
  try {
    // Ensure category exists
    let cat = db.prepare('SELECT id FROM menu_categories WHERE name = ?').get(category);
    if (!cat) {
      const result = db.prepare('INSERT INTO menu_categories (name) VALUES (?)').run(category);
      cat = { id: result.lastInsertRowid };
    }

    // Insert or Replace item
    db.prepare(`
      INSERT OR REPLACE INTO menu_items (id, category_id, name, price, type, show, images)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      item.id,
      cat.id,
      item.name,
      item.price,
      item.type,
      item.show ? 1 : 0,
      JSON.stringify(item.images)
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Item
app.delete('/api/menu/item/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle Visibility
app.post('/api/menu/item/:id/toggle', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('UPDATE menu_items SET show = 1 - show WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ANALYTICS API ---

// Track a visit
app.post('/api/analytics/track', (req, res) => {
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ua = req.headers['user-agent'];

  try {
    // Log the visit
    db.prepare('INSERT INTO visitor_logs (ip, user_agent) VALUES (?, ?)').run(ip, ua);

    // Update daily analytics
    const existing = db.prepare('SELECT * FROM analytics WHERE date = ?').get(today);
    if (existing) {
      db.prepare('UPDATE analytics SET visitors = visitors + 1 WHERE date = ?').run(today);
    } else {
      db.prepare('INSERT INTO analytics (date, visitors, peak_time, watch_time) VALUES (?, 1, "7:00 PM", 0.5)').run(today);
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Tracking error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get analytics data
app.get('/api/analytics', (req, res) => {
  try {
    const data = db.prepare('SELECT * FROM analytics ORDER BY id ASC').all();
    res.json(data.map(d => ({
      date: d.date,
      visitors: d.visitors,
      peakTimeStr: d.peak_time,
      watchTime: d.watch_time
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset analytics
app.post('/api/analytics/reset', (req, res) => {
  try {
    db.prepare('DELETE FROM analytics').run();
    db.prepare('DELETE FROM visitor_logs').run();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- FRONTEND SERVING ---
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
