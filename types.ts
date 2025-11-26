export type UserRole = 'donor' | 'ngo' | null;

export interface Profile {
  id: string;
  role: UserRole;
  organization_name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export type DonationStatus = 'available' | 'reserved' | 'picked_up';

export type FoodCategory = 'Cooked Meals' | 'Raw Produce' | 'Dairy' | 'Grains' | 'Bakery' | 'Other';

export interface ClaimerInfo {
  name: string;
  contact: string;
  id?: string; // Added ID for robust tracking
}

export interface Donation {
  id: string;
  donor_id: string;
  donor_name: string; // Denormalized for display
  donor_contact?: string; // Revealed only when claimed
  food_title: string;
  category: FoodCategory; // New Field
  quantity: string; // e.g. "20 servings"
  best_before: string;
  pickup_address: string;
  latitude: number;
  longitude: number;
  image_url: string;
  status: DonationStatus;
  created_at: string;
  distance?: number; // Calculated on client
  claimedBy?: ClaimerInfo; // New field to track claimer
}

export interface Coordinates {
  lat: number;
  lng: number;
}