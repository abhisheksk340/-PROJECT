import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Donation, Profile, UserRole, ClaimerInfo, DonationStatus, FoodCategory } from './types';

// Initial Mock Data with reliable vegetarian images
const MOCK_DONATIONS: Donation[] = [
  {
    id: '1',
    donor_id: 'd1',
    donor_name: 'Spice Garden Bistro',
    donor_contact: '+91 98765 43210',
    food_title: 'Vegetable Dum Biryani',
    category: 'Cooked Meals',
    quantity: '15 Servings',
    best_before: '2023-10-28T22:00:00',
    pickup_address: '12 Main St, Downtown',
    latitude: 12.9716, // Bangalore Center
    longitude: 77.5946,
    // Updated to a clearly Vegetarian Rice dish (Veg Pulao/Thali)
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', 
    status: 'available',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    donor_id: 'd2',
    donor_name: 'Daily Bread Bakery',
    donor_contact: '+91 99887 76655',
    food_title: 'Assorted Artisan Breads',
    category: 'Bakery',
    quantity: '5kg',
    best_before: '2023-10-29T10:00:00',
    pickup_address: '45 Baker Ave',
    latitude: 12.9780, // Slightly North
    longitude: 77.6000,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop', // Bread
    status: 'available',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    donor_id: 'd1',
    donor_name: 'Spice Garden Bistro',
    donor_contact: '+91 98765 43210',
    food_title: 'Paneer Butter Masala',
    category: 'Cooked Meals',
    quantity: '10 Servings',
    best_before: '2023-10-28T23:00:00',
    pickup_address: '12 Main St, Downtown',
    latitude: 12.9750,
    longitude: 77.5900,
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop', // Paneer/Curry (Veg)
    status: 'reserved',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    claimedBy: {
      name: 'Hope Foundation',
      contact: '+91 98765 43210',
      id: 'mock-ngo-id'
    }
  }
];

interface UserProfile {
  id: string; // Added ID
  name: string;
  email?: string;
  phone?: string;
  avatar: string;
  contact: string;
}

export type AuthMethod = 'google' | 'facebook' | 'email' | 'phone';

interface StoreContextType {
  userRole: UserRole;
  userProfile: UserProfile | null;
  login: (method: AuthMethod, role: UserRole, data?: any, type?: 'login' | 'register') => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  donations: Donation[];
  addDonation: (donation: Omit<Donation, 'id' | 'created_at' | 'status' | 'donor_id' | 'donor_name' | 'distance'>) => void;
  claimDonation: (id: string, claimer: ClaimerInfo) => void;
  updateDonationStatus: (id: string, status: DonationStatus) => void;
  isLoading: boolean;
  userLocation: { lat: number; lng: number } | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper to calculate distance in km
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load Session from Local Storage
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('mealbridge_role') as UserRole) || null;
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mealbridge_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // Load Donations from Local Storage or fallback to Mock
  const [donations, setDonations] = useState<Donation[]>(() => {
    const saved = localStorage.getItem('mealbridge_donations');
    return saved ? JSON.parse(saved) : MOCK_DONATIONS;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock Database of Registered Users - Persisted to Local Storage
  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('mealbridge_users');
    return saved ? JSON.parse(saved) : [
      { email: 'user@example.com', phone: '9999999999', password: 'password', id: 'u1', name: 'Abhishek SK' }, 
      { phone: '9876543210', password: 'password', id: 'u2', name: 'Mobile User' }
    ];
  });

  // Save registered users whenever they change
  useEffect(() => {
    localStorage.setItem('mealbridge_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Save donations whenever they change
  useEffect(() => {
    localStorage.setItem('mealbridge_donations', JSON.stringify(donations));
  }, [donations]);

  // Save session state whenever it changes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('mealbridge_role', userRole);
    } else {
      localStorage.removeItem('mealbridge_role');
    }
  }, [userRole]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('mealbridge_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('mealbridge_profile');
    }
  }, [userProfile]);

  // --- CROSS-TAB SYNCHRONIZATION ---
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mealbridge_donations' && e.newValue) {
        console.log('Syncing donations from other tab...');
        setDonations(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  // Get User Location on Mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location", error);
          // Default fallback location (Bangalore) if permission denied
          setUserLocation({ lat: 12.9716, lng: 77.5946 });
        }
      );
    }
  }, []);

  // Update distances when location or donations change
  useEffect(() => {
    if (userLocation) {
      setDonations(prev => prev.map(d => ({
        ...d,
        distance: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, d.latitude, d.longitude)
      })));
    }
  }, [userLocation]);

  const login = async (method: AuthMethod, role: UserRole, data?: any, type: 'login' | 'register' = 'login') => {
    setIsLoading(true);
    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        // --- STRICT AUTH LOGIC ---
        // Initialize with random ID by default
        let userId = 'user_' + Math.random().toString(36).substr(2, 9);
        let userName = 'Abhishek SK'; // Default name for new users if not specified

        if (method === 'email') {
            userName = data.email.split('@')[0];
            if (type === 'register') {
                const exists = registeredUsers.find(u => u.email === data.email);
                if (exists) throw new Error("This email is already registered. Please log in.");
                
                // Register new user
                const newUser = { ...data, id: userId, name: userName };
                setRegisteredUsers(prev => [...prev, newUser]);
            } else {
                // Login
                const user = registeredUsers.find(u => u.email === data.email);
                if (!user) throw new Error("Account not found. Please sign up first.");
                if (user.password !== data.password) throw new Error("Incorrect password.");
                
                // Merge stored data
                data = { ...data, ...user };
                userId = user.id || userId;
                userName = user.name || userName;
            }
        } else if (method === 'phone') {
            userName = "Mobile User";
            if (type === 'register') {
                const exists = registeredUsers.find(u => u.phone === data.phone);
                if (exists) throw new Error("This phone number is already registered. Please log in.");
                
                const newUser = { ...data, id: userId, name: userName };
                setRegisteredUsers(prev => [...prev, newUser]);
            } else {
                // Login
                const user = registeredUsers.find(u => u.phone === data.phone);
                if (!user) throw new Error("Phone number not registered. Please sign up first.");
                if (user.password !== data.password) throw new Error("Incorrect password.");
                
                 // Merge stored data
                 data = { ...data, ...user };
                 userId = user.id || userId;
                 userName = user.name || userName;
            }
        } else if (method === 'google') {
            // Consistent ID for demo purposes so history persists
            userId = 'user_google_demo'; 
            userName = "Google User";
        } else if (method === 'facebook') {
            // Consistent ID for demo purposes
            userId = 'user_fb_demo';
            userName = "Facebook User";
        }

        // --- PROFILE CREATION ---

        let profile: UserProfile = {
            id: userId,
            name: userName,
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
            contact: '', 
            email: ''
        };

        if (method === 'email') {
            profile.email = data.email;
            profile.contact = data.phone || ''; 
        } else if (method === 'phone') {
            profile.contact = data.phone;
            profile.phone = data.phone;
        } else if (method === 'google') {
            profile.email = "user@gmail.com";
            profile.contact = ''; // User needs to update
        } else if (method === 'facebook') {
            profile.contact = ''; // User needs to update
        }

        setUserProfile(profile);
        setUserRole(role);
    } catch (error) {
        setIsLoading(false);
        throw error; // Propagate to component
    }

    setIsLoading(false);
  };

  const logout = () => {
    setUserRole(null);
    setUserProfile(null);
    localStorage.removeItem('mealbridge_role');
    localStorage.removeItem('mealbridge_profile');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const addDonation = (newDonationData: Omit<Donation, 'id' | 'created_at' | 'status' | 'donor_id' | 'donor_name' | 'distance'>) => {
    setIsLoading(true);
    setTimeout(() => {
      // CRITICAL: Force use of current profile name
      const currentDonorName = userProfile?.name || 'Abhishek SK'; 
      const currentDonorId = userProfile?.id || 'currentUser';
      const currentContact = userProfile?.contact || '';

      const newDonation: Donation = {
        ...newDonationData,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        status: 'available',
        donor_id: currentDonorId,
        donor_name: currentDonorName,
        donor_contact: currentContact,
        distance: userLocation 
          ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, newDonationData.latitude, newDonationData.longitude)
          : 0
      };
      
      const updatedList = [newDonation, ...donations];
      setDonations(updatedList);
      // Explicitly saving here too, though useEffect handles it, for safety
      localStorage.setItem('mealbridge_donations', JSON.stringify(updatedList));
      
      setIsLoading(false);
    }, 500);
  };

  const claimDonation = (id: string, claimer: ClaimerInfo) => {
    // Optimistic UI update
    const updatedList = donations.map(d => 
      d.id === id ? { ...d, status: 'reserved' as DonationStatus, claimedBy: claimer } : d
    );
    setDonations(updatedList);
    localStorage.setItem('mealbridge_donations', JSON.stringify(updatedList));
  };

  const updateDonationStatus = (id: string, status: DonationStatus) => {
    const updatedList = donations.map(d => 
      d.id === id ? { ...d, status } : d
    );
    setDonations(updatedList);
    localStorage.setItem('mealbridge_donations', JSON.stringify(updatedList));
  };

  return (
    <StoreContext.Provider value={{ 
      userRole, 
      userProfile,
      login, 
      logout,
      updateProfile,
      donations, 
      addDonation, 
      claimDonation,
      updateDonationStatus, 
      isLoading,
      userLocation
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};