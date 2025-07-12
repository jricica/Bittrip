import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function insertStubGiftcard() {
  const { data, error } = await supabase.from('all_giftcards').insert([
    {
      external_id: 'stub-001',
      name: 'Sample Giftcard',
      country: 'USA',
      price: 25.0,
      description: 'This is a sample giftcard for testing.',
      provider: 'SampleProvider',
      expiry: '2025-12-31',
      esim_data: { data: 'sample esim info' },
      category_id: 'cat_food',
      is_active: true,
      last_synced: new Date().toISOString(),
    }
  ]);

  if (error) {
    console.error('Error inserting stub giftcard:', error);
  } else {
    console.log('Inserted stub giftcard:', data);
  }
}

insertStubGiftcard();
