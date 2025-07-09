export type Schema = {
  users: {
    id?: string;
    name: string;
    email: string;
    profileImage?: string | null;
  };
  trips: {
    id?: string;
    name: string;
    startDate: string;
    endDate: string;
    budget: number;
    userId: string;
    status?: string;
    createdAt?: string;
  };
  tripDays: {
    id?: string;
    tripId: string;
    date: string;
    description?: string | null;
  };
  activities: {
    id?: string;
    tripDayId: string;
    name: string;
    time?: string | null;
    location?: string | null;
    cost?: number | null;
    category: string;
  };
  giftCards: {
    id?: string;
    provider: string;
    amount: number;
    purchaseDate: string;
    expiryDate?: string | null;
    userId: string;
    tripId?: string | null;
  };
  categories: {
    id?: string;
    name: string;
    icon: string;
  };
};