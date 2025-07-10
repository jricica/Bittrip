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
app.use(cors());
app.use(express.json());

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
  const { data, error } = await supabase.from('tripDays').select('*');
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

app.post('/trip-days', async (req, res) => {
  const { data, error } = await supabase.from('tripDays').insert([req.body]);
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

// --- GIFT CARDS ---
app.get('/gift-cards', async (req, res) => {
  const { data, error } = await supabase.from('giftCards').select('*');
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

app.post('/gift-cards', async (req, res) => {
  const { data, error } = await supabase.from('giftCards').insert([req.body]);
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

// --- CATEGORIES ---
app.get('/categories', async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*');
  error ? res.status(500).json({ error: error.message }) : res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API corriendo en http://localhost:${PORT}`);
});