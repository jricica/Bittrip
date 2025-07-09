-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  profileImage TEXT
);

-- Create trips table
CREATE TABLE trips (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT NOT NULL,
  budget REAL NOT NULL,
  userId TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create trip days table
CREATE TABLE tripDays (
  id TEXT PRIMARY KEY,
  tripId TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE
);

-- Create activities table
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  tripDayId TEXT NOT NULL,
  name TEXT NOT NULL,
  time TEXT,
  location TEXT,
  cost REAL,
  category TEXT NOT NULL,
  FOREIGN KEY (tripDayId) REFERENCES tripDays(id) ON DELETE CASCADE
);

-- Create gift cards table
CREATE TABLE giftCards (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  amount REAL NOT NULL,
  purchaseDate TEXT NOT NULL,
  expiryDate TEXT,
  userId TEXT NOT NULL,
  tripId TEXT,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE SET NULL
);

-- Create categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL
);

-- Insert default categories
INSERT INTO categories (id, name, icon) VALUES
('cat_food', 'Food', 'utensils'),
('cat_transport', 'Transport', 'car'),
('cat_locations', 'Locations', 'map-pin'),
('cat_esim', 'eSIM', 'wifi'),
('cat_trips', 'Suggested Trips', 'compass'),
('cat_events', 'Popular Events', 'calendar');