-- USERS
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  profileImage TEXT,
  fid TEXT UNIQUE
);

-- TRIPS
CREATE TABLE trips (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  budget REAL NOT NULL,
  userId TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- TRIP DAYS
CREATE TABLE trip_days (
  id TEXT PRIMARY KEY,
  tripId TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE
);

-- ACTIVITIES
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  tripDayId TEXT NOT NULL,
  name TEXT NOT NULL,
  time TEXT,
  location TEXT,
  cost REAL,
  category TEXT NOT NULL,
  FOREIGN KEY (tripDayId) REFERENCES trip_days(id) ON DELETE CASCADE
);

-- USER GIFT CARDS (PERSONAL PURCHASE HISTORY)
CREATE TABLE gift_cards (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  amount REAL NOT NULL,
  purchaseDate DATE NOT NULL,
  expiryDate DATE,
  userId TEXT NOT NULL,
  tripId TEXT,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE SET NULL
);

-- CATEGORIES TABLE
CREATE TABLE categories (
  id TEXT PRIMARY KEY,        -- e.g. 'cat_travel'
  name TEXT NOT NULL,         -- e.g. 'Travel'
  icon TEXT NOT NULL          -- e.g. 'plane'
);

-- MASTER GIFT CARD CATALOG (DAILY REFRESHED)

CREATE TABLE all_giftcards (
  id TEXT PRIMARY KEY,                         -- "xl-indonesia"
  name TEXT NOT NULL,                          -- "XL Indonesia"
  country_code TEXT,                           -- "ID"
  country_name TEXT,                           -- "Indonesia"
  currency TEXT,                               -- "IDR"
  categories TEXT[] DEFAULT '{}',              -- ["refill"]
  recipient_type TEXT,                         -- "phone_number"
  image TEXT,                                  -- "xl-indonesia"
  terms_and_conditions TEXT,                   -- "[String of tC]"
  in_stock BOOLEAN DEFAULT true,
  packages JSONB,
  last_synced TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USER PLANS (CARTS)
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RELATIONSHIP: PLAN CONTAINS MANY GIFT CARDS (FIXED TYPE)
CREATE TABLE plan_giftcards (
  id SERIAL PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  giftcard_id TEXT NOT NULL REFERENCES all_giftcards(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  price_snapshot NUMERIC(10, 2),
  name_snapshot TEXT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(plan_id, giftcard_id)
);