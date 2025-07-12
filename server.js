// @ts-check
// server.js (ESM)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
app.use(express.json());

// --- AUTH ROUTES ---
/** @typedef {{email: string, password: string}} AuthBody */

app.post('/api/signup', async (req, res) => {
  /** @type {AuthBody} */
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    res.json({ user: data.user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  /** @type {AuthBody} */
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    res.json({ session: data.session, user: data.user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.post('/api/logout', async (_req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    res.json({ users: data.users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- USERS ---
app.get('/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

app.post('/users', async (req, res) => {
  const { data, error } = await supabase.from('users').insert([req.body]);
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

// --- TRIPS ---
app.get('/trips', async (req, res) => {
  const { data, error } = await supabase.from('trips').select('*');
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

app.post('/trips', async (req, res) => {
  const { data, error } = await supabase.from('trips').insert([req.body]);
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

// --- TRIP DAYS ---
app.get('/trip-days', async (req, res) => {
  const { data, error } = await supabase.from('trip_days').select('*');
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

app.post('/trip-days', async (req, res) => {
  const { data, error } = await supabase.from('trip_days').insert([req.body]);
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

// --- ACTIVITIES ---
app.get('/activities', async (req, res) => {
  const { data, error } = await supabase.from('activities').select('*');
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

app.post('/activities', async (req, res) => {
  const { data, error } = await supabase.from('activities').insert([req.body]);
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

// --- USER'S GIFT CARD PURCHASES ---
app.get('/gift-cards', async (req, res) => {
  const { data, error } = await supabase.from('gift_cards').select('*');
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

app.post('/gift-cards', async (req, res) => {
  const { data, error } = await supabase.from('gift_cards').insert([req.body]);
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

// --- ALL GIFT CARDS (DAILY API SYNC) ---
app.get('/all-giftcards', async (req, res) => {
  const { data, error } = await supabase.from('all_giftcards').select('*').eq('is_active', true);
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

// --- CATEGORIES ---
app.get('/categories', async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*');
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

// --- PLANS (CARTS) ---
app.get('/plans', async (req, res) => {
  const { data, error } = await supabase.from('plans').select('*');
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

app.post('/plans', async (req, res) => {
  const { data, error } = await supabase.from('plans').insert([req.body]);
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

// --- PLAN GIFT CARDS (CART ITEMS) ---
app.get('/plan-giftcards', async (req, res) => {
  const { plan_id } = req.query;
  const query = supabase.from('plan_giftcards').select('*');
  if (plan_id) query.eq('plan_id', plan_id);

  const { data, error } = await query;
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

app.post('/plan-giftcards', async (req, res) => {
  const { data, error } = await supabase.from('plan_giftcards').insert([req.body]);
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ API corriendo en http://localhost:${PORT}`);
});