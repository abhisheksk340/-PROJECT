import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StoreProvider, useStore } from './store';
import { Leaf, Heart, MapPin, Menu, X, ArrowRight, ShieldCheck, Clock, User, LogOut, Linkedin, Github, CheckCircle, List, Mail, Navigation, HeartHandshake, Phone, Facebook, Lock, Smartphone, Instagram, Youtube, AlertTriangle, Edit, Smile, ExternalLink, Map as MapIcon, Grid, Plus, Minus, Layers, Building, History, Archive } from 'lucide-react';
import { Donation, FoodCategory } from './types';

// Helper for image fallback - Ensuring Vegetarian Default
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop"; // Fallback Veg Salad
};

// --- MOCK ADDRESS SUGGESTIONS WITH COORDINATES ---
// Real coordinates for demo purposes to ensure "Navigate" works accurately
const MOCK_LOCATIONS: { label: string, lat: number, lng: number }[] = [
  { label: "M.G. Road, Bangalore", lat: 12.9756, lng: 77.6066 },
  { label: "Indiranagar, Bangalore", lat: 12.9784, lng: 77.6408 },
  { label: "Koramangala 5th Block, Bangalore", lat: 12.9352, lng: 77.6245 },
  { label: "Whitefield Main Road, Bangalore", lat: 12.9698, lng: 77.7500 },
  { label: "Jayanagar 4th Block, Bangalore", lat: 12.9299, lng: 77.5824 },
  { label: "HSR Layout Sector 2, Bangalore", lat: 12.9116, lng: 77.6389 },
  { label: "Brigade Road, Bangalore", lat: 12.9673, lng: 77.6074 },
  { label: "Commercial Street, Bangalore", lat: 12.9822, lng: 77.6083 },
  { label: "Malleshwaram, Bangalore", lat: 13.0031, lng: 77.5643 },
  { label: "Electronic City Phase 1, Bangalore", lat: 12.8399, lng: 77.6770 },
  { label: "Hebbal, Bangalore", lat: 13.0354, lng: 77.5988 },
  { label: "Banashankari, Bangalore", lat: 12.9255, lng: 77.5468 },
  { label: "Basavanagudi, Bangalore", lat: 12.9406, lng: 77.5738 },
  { label: "Marathahalli, Bangalore", lat: 12.9591, lng: 77.6974 },
  { label: "BTM Layout, Bangalore", lat: 12.9166, lng: 77.6101 },
  { label: "Rajajinagar, Bangalore", lat: 12.9901, lng: 77.5525 },
  { label: "Yelahanka, Bangalore", lat: 13.1007, lng: 77.5963 },
  { label: "Sarjapur Road, Bangalore", lat: 12.9244, lng: 77.6503 },
  { label: "Bannerghatta Road, Bangalore", lat: 12.8953, lng: 77.5985 },
  { label: "JP Nagar, Bangalore", lat: 12.9063, lng: 77.5857 }
];

// --- SMART IMAGE SELECTION HELPER ---
// Selects a relevant Vegetarian image based on the food title and category
const getRelevantFoodImage = (title: string, category?: FoodCategory): string => {
  const t = title.toLowerCase();
  
  // 1. RICE VARIETIES (Strict checks first)
  if (t.includes('plain rice') || t.includes('white rice') || t.includes('steam rice') || t.includes('steamed rice')) {
    // White Rice Bowl - Clear top down view
    return 'https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=800&auto=format&fit=crop'; 
  }
  if (t.includes('biryani') || t.includes('pulao') || t.includes('fried rice') || t.includes('jeera rice')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop'; // Veg Biryani
  }
  if (t.includes('rice')) { 
     // Fallback if user just typed "Rice" -> Default to White Rice
     return 'https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=800&auto=format&fit=crop'; 
  }

  // 2. CURRIES & PANEER
  if (t.includes('paneer') || t.includes('butter masala') || t.includes('shahi') || t.includes('matar')) {
      return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800&auto=format&fit=crop'; // Paneer Curry
  }
  if (t.includes('dal') || t.includes('lentil') || t.includes('sambar') || t.includes('rasam')) {
      return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop'; // Dal/Soup
  }
  if (t.includes('curry') || t.includes('gravy') || t.includes('kofta') || t.includes('sabzi') || t.includes('bhaji') || t.includes('aloo') || t.includes('gobi')) {
      return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop'; // Generic Curry
  }

  // 3. BREADS
  if (t.includes('roti') || t.includes('chapati') || t.includes('naan') || t.includes('paratha') || t.includes('kulcha') || t.includes('bread') || t.includes('bun')) {
      return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop'; // Roti Basket
  }

  // 4. SOUTH INDIAN
  if (t.includes('idli') || t.includes('dosa') || t.includes('vada') || t.includes('uttapam') || t.includes('upma')) {
      return 'https://images.unsplash.com/photo-1589301760574-d816284cdb6f?q=80&w=800&auto=format&fit=crop'; // Idli/Dosa
  }

  // 5. FAST FOOD / SNACKS
  if (t.includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop';
  if (t.includes('burger') || t.includes('sandwich')) return 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop';
  if (t.includes('pasta') || t.includes('noodles') || t.includes('chowmein') || t.includes('maggi')) return 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop';

  // 6. DESSERTS / FRUITS
  if (t.includes('fruit') || t.includes('apple') || t.includes('banana') || t.includes('orange') || t.includes('mango')) {
      return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop';
  }
  if (t.includes('cake') || t.includes('sweet') || t.includes('dessert') || t.includes('halwa') || t.includes('gulab jamun') || t.includes('ladoo') || t.includes('mithai')) {
      return 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop';
  }
  
  // 7. BEVERAGES
  if (t.includes('tea') || t.includes('chai') || t.includes('coffee') || t.includes('juice') || t.includes('milk')) {
      return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop';
  }

  // Priority 2: Category Fallbacks
  if (category) {
      if (category === 'Raw Produce') return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop';
      if (category === 'Bakery') return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop';
      if (category === 'Dairy') return 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=800&auto=format&fit=crop';
      if (category === 'Grains') return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop';
  }

  // Default Veg Salad Bowl (Safe fallback)
  return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop';
}

// Confetti Component for Party Mode
const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute top-[-20px] animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 6}px`,
            height: `${Math.random() * 8 + 6}px`,
            backgroundColor: ['#10B981', '#F59E0B', '#EC4899', '#3B82F6', '#8B5CF6', '#FCD34D'][Math.floor(Math.random() * 6)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${Math.random() * 360}deg)`,
            animationDuration: `${Math.random() * 2 + 2}s`,
            animationDelay: `${Math.random() * 1.5}s`
          }}
        />
      ))}
    </div>
  );
};

// --- REUSABLE MAP COMPONENT ---
interface MapViewProps {
    donations?: Donation[];
    userLocation: { lat: number; lng: number } | null;
    onClaim?: (id: string) => void;
    enableClustering?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ 
    donations = [], 
    userLocation, 
    onClaim, 
    enableClustering = true
}) => {
    const [zoom, setZoom] = useState(1);
    const [mapCenter, setMapCenter] = useState(userLocation || { lat: 12.9716, lng: 77.5946 });
    const [selectedPin, setSelectedPin] = useState<string | null>(null);
    
    // Reset center when userLocation changes
    useEffect(() => {
        if(userLocation) setMapCenter(userLocation);
    }, [userLocation]);

    const range = 0.05 / zoom; 

    const getPosition = (lat: number, lng: number) => {
        const y = ((mapCenter.lat + range - lat) / (range * 2)) * 100;
        const x = ((lng - (mapCenter.lng - range)) / (range * 2)) * 100;
        return { top: `${Math.max(-20, Math.min(120, y))}%`, left: `${Math.max(-20, Math.min(120, x))}%` };
    };

    const clusters = useMemo(() => {
        if (!enableClustering) return [];
        const grouped: { lat: number, lng: number, items: Donation[] }[] = [];
        donations.forEach(d => {
            const found = grouped.find(g => {
                 const dPos = getPosition(d.latitude, d.longitude);
                 const gPos = getPosition(g.lat, g.lng);
                 const dy = parseFloat(dPos.top) - parseFloat(gPos.top);
                 const dx = parseFloat(dPos.left) - parseFloat(gPos.left);
                 return Math.sqrt(dx*dx + dy*dy) < 8;
            });
            if (found) found.items.push(d);
            else grouped.push({ lat: d.latitude, lng: d.longitude, items: [d] });
        });
        return grouped;
    }, [donations, zoom, mapCenter, enableClustering]);

    const handleClusterClick = (c: {lat: number, lng: number, items: Donation[]}) => {
        if (c.items.length > 1) {
            setMapCenter({ lat: c.lat, lng: c.lng });
            setZoom(prev => Math.min(prev * 2, 8));
            setSelectedPin(null);
        } else {
            setSelectedPin(c.items[0].id === selectedPin ? null : c.items[0].id);
        }
    };

    return (
        <div 
            className="bg-emerald-50 rounded-3xl w-full relative overflow-hidden shadow-inner border border-emerald-100 group select-none h-[600px] cursor-default"
        >
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           
           <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
               <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(z + 1, 8)); }} className="p-2 bg-white rounded-lg shadow-md hover:bg-emerald-50 text-emerald-700 font-bold"><Plus className="w-5 h-5"/></button>
               <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(z - 1, 1)); }} className="p-2 bg-white rounded-lg shadow-md hover:bg-emerald-50 text-emerald-700 font-bold"><Minus className="w-5 h-5"/></button>
           </div>

           {/* Clusters */}
           {clusters.map((c, idx) => {
               const pos = getPosition(c.lat, c.lng);
               if (parseFloat(pos.top) < -20 || parseFloat(pos.top) > 120 || parseFloat(pos.left) < -20 || parseFloat(pos.left) > 120) return null;
               
               const isCluster = c.items.length > 1;
               const isSelected = !isCluster && c.items[0].id === selectedPin;

               return (
                   <div 
                      key={idx}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 hover:z-50 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}`}
                      style={pos}
                      onClick={(e) => { e.stopPropagation(); handleClusterClick(c); }}
                   >
                      {isCluster ? (
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-500 border-2 border-white text-white font-bold shadow-lg animate-bounce-in">
                              +{c.items.length}
                          </div>
                      ) : (
                          <MapPin className={`h-8 w-8 drop-shadow-md ${isSelected ? 'text-amber-500 fill-amber-100 h-10 w-10' : 'text-emerald-600 fill-emerald-100'}`} />
                      )}
                      
                      {isSelected && onClaim && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-white rounded-xl shadow-2xl p-0 overflow-hidden border border-stone-100 animate-bounce-in z-50 cursor-default">
                              <div className="relative h-32">
                                  <img src={c.items[0].image_url} className="w-full h-full object-cover" alt="Food" onError={handleImageError} />
                                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded text-xs font-bold text-emerald-700 shadow-sm">
                                      {c.items[0].distance?.toFixed(1)} km
                                  </div>
                              </div>
                              <div className="p-3 text-center">
                                  <h4 className="font-bold text-slate-800 text-sm truncate">{c.items[0].food_title}</h4>
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); onClaim(c.items[0].id); }}
                                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition mt-2"
                                  >
                                      Claim Donation
                                  </button>
                              </div>
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-b border-r border-stone-100"></div>
                          </div>
                      )}
                   </div>
               );
           })}
           
           <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow text-xs font-bold text-slate-500 flex items-center">
               <Layers className="w-3 h-3 mr-1" /> {`Zoom: ${zoom}x`}
           </div>
        </div>
    );
};

// --- COMPONENTS ---

// 1. Navigation
const Navbar = ({ onNavigate, onLoginClick }: { onNavigate: (page: string) => void, onLoginClick: (role: 'donor' | 'ngo') => void }) => {
  const { userRole, logout, userProfile } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('landing');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('landing')}>
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 mr-2 group-hover:bg-emerald-100 transition-colors">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <span className="font-heading font-bold text-xl text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">MealBridge</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {!userRole ? (
              <>
                <button onClick={() => onNavigate('landing')} className="text-slate-600 hover:text-emerald-600 font-medium transition">Home</button>
                <button onClick={() => onLoginClick('donor')} className="text-slate-600 hover:text-emerald-600 font-medium transition">Donate</button>
                <button onClick={() => onLoginClick('ngo')} className="px-5 py-2 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  NGO Access
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center">
                  <User className="h-3 w-3 mr-2 text-slate-400" />
                  {userProfile?.name}
                  <span className="mx-2 text-slate-300">|</span>
                  {userRole === 'donor' ? 'Donor Mode' : 'NGO Mode'}
                </span>
                <button onClick={handleLogout} className="flex items-center text-slate-600 hover:text-red-500 transition font-medium">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 p-2 hover:bg-slate-100 rounded-md transition">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2">
             {!userRole ? (
                <>
                  <button onClick={() => { onNavigate('landing'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-slate-600 font-medium hover:bg-stone-50 rounded-lg">Home</button>
                  <button onClick={() => { onLoginClick('donor'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-slate-600 font-medium hover:bg-stone-50 rounded-lg">Donate Food</button>
                  <button onClick={() => { onLoginClick('ngo'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-emerald-600 font-bold bg-emerald-50 rounded-lg">Find Food</button>
                </>
             ) : (
               <button onClick={handleLogout} className="block w-full text-left px-3 py-3 text-red-500 font-medium hover:bg-red-50 rounded-lg">Logout</button>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Login Modal
const LoginModal = ({ 
  isOpen, 
  onClose, 
  targetRole 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  targetRole: 'donor' | 'ngo' | null 
}) => {
  const { login, isLoading } = useStore();
  // Changed default to 'phone'
  const [method, setMethod] = useState<'email' | 'phone'>('phone');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !targetRole) return null;

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
        setError('');
        await login(provider, targetRole);
        onClose();
    } catch (err: any) {
        setError(err.message);
    }
  };

  const validateForm = () => {
      // Phone Validation: Min 10 digits
      const phoneRegex = /^\d{10,}$/;
      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (method === 'phone') {
          if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
              setError("Please enter a valid phone number (min 10 digits).");
              return false;
          }
      }
      if (method === 'email') {
          if (!emailRegex.test(email)) {
              setError("Please enter a valid email address.");
              return false;
          }
          if (isRegister && phone && !phoneRegex.test(phone.replace(/\D/g, ''))) {
              setError("Please enter a valid contact number (min 10 digits).");
              return false;
          }
      }
      return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
        if (method === 'email' && email && password) {
            // Pass 'isRegister' to store to enforce strict login/signup
            await login('email', targetRole, { email, password, phone }, isRegister ? 'register' : 'login');
        } else if (method === 'phone' && phone && password) {
            await login('phone', targetRole, { phone, password }, isRegister ? 'register' : 'login');
        }
        onClose();
    } catch (err: any) {
        setError(err.message || "Authentication failed. Please try again.");
    }
  };

  // Reset error when switching modes
  const toggleMode = () => {
      setIsRegister(!isRegister);
      setError('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
        <div className="bg-emerald-600 p-6 relative flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-emerald-100 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-white mb-1">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-emerald-100 text-sm">
            {targetRole === 'donor' ? 'Partner with us to save food.' : 'Join the network to feed people.'}
          </p>
        </div>
        
        <div className="p-8 overflow-y-auto">
          
          {/* Tabs - PHONE FIRST */}
          <div className="flex mb-6 border-b border-stone-200">
             <button 
                onClick={() => { setMethod('phone'); setError(''); }}
                className={`flex-1 pb-3 text-sm font-bold text-center transition ${method === 'phone' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Phone
             </button>
             <button 
                onClick={() => { setMethod('email'); setError(''); }}
                className={`flex-1 pb-3 text-sm font-bold text-center transition ${method === 'email' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Email
             </button>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg flex items-start">
                <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 mb-6">
            {method === 'phone' ? (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                        <Smartphone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                        placeholder="+91 98765 43210"
                        required={method === 'phone'}
                        />
                    </div>
                </div>
            ) : (
                <>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                          <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                          placeholder="name@example.com"
                          required={method === 'email'}
                          />
                      </div>
                  </div>
                  {/* PHONE FIELD FOR EMAIL SIGNUP */}
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number {isRegister ? '(Required)' : '(Optional)'}</label>
                      <div className="relative">
                          <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                          <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                          placeholder="+91 98765 43210"
                          required={isRegister} // Required only on registration
                          />
                      </div>
                  </div>
                </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition shadow-md mt-2"
            >
              {isLoading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Log In')}
            </button>
          </form>
          
          <div className="text-center mb-6">
             <button 
                type="button"
                onClick={toggleMode}
                className="text-sm text-emerald-600 font-medium hover:underline"
             >
                {isRegister ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
             </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-stone-400">or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* GOOGLE FIRST */}
            <button 
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-white border border-stone-300 hover:bg-stone-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition shadow-sm hover:shadow-md"
            >
               <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
               </svg>
               Gmail
            </button>

            <button 
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-[#1877F2] text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-[#166fe5] transition shadow-sm hover:shadow-md"
            >
              <Facebook className="w-5 h-5 mr-3 fill-current" />
              Facebook
            </button>
          </div>
          <p className="mt-6 text-center text-xs text-stone-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

// 2. Landing Page
const LandingPage = ({ onLoginClick }: { onLoginClick: (role: 'donor' | 'ngo') => void }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Volunteers serving food" 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/80 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 text-emerald-100 backdrop-blur-md text-sm font-medium shadow-sm">
              <HeartHandshake className="w-4 h-4 mr-2 text-emerald-300" />
              Bridging the gap between abundance and need
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 drop-shadow-xl leading-tight tracking-tight animate-fade-in-up delay-100">
            We make a living by what we get,<br />
            but we make a life by what we give.
          </h1>
          <p className="text-xl text-stone-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200 text-shadow-md">
            Turn surplus into sustenance. Connect your restaurant's extra food with local shelters instantly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5 animate-fade-in-up delay-300">
            <button 
              onClick={() => onLoginClick('donor')}
              className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition transform hover:-translate-y-1 shadow-xl hover:shadow-emerald-900/30 flex items-center justify-center ring-4 ring-transparent hover:ring-emerald-500/30"
              aria-label="I want to Donate"
            >
              I want to Donate <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button 
              onClick={() => onLoginClick('ngo')}
              className="px-8 py-4 bg-amber-500 text-white rounded-full font-bold text-lg hover:bg-amber-600 transition transform hover:-translate-y-1 shadow-xl hover:shadow-amber-900/30 flex items-center justify-center ring-4 ring-transparent hover:ring-amber-500/30"
              aria-label="I need Food"
            >
              I need Food <MapPin className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-b border-stone-100 shadow-sm relative z-20 -mt-8 rounded-t-3xl mx-4 lg:mx-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-around text-center divide-y md:divide-y-0 md:divide-x divide-stone-100">
          <div className="py-4 md:py-0 md:px-8">
            <p className="text-5xl font-heading font-bold text-emerald-600">12,450+</p>
            <p className="text-slate-500 mt-2 font-medium uppercase tracking-wider text-xs">Meals Saved</p>
          </div>
          <div className="py-4 md:py-0 md:px-8">
            <p className="text-5xl font-heading font-bold text-amber-500">850 kg</p>
            <p className="text-slate-500 mt-2 font-medium uppercase tracking-wider text-xs">CO2 Prevented</p>
          </div>
          <div className="py-4 md:py-0 md:px-8">
            <p className="text-5xl font-heading font-bold text-slate-800">124</p>
            <p className="text-slate-500 mt-2 font-medium uppercase tracking-wider text-xs">Partner NGOs</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-stone-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Built with Code, Driven by Compassion</h2>
            <div className="h-1.5 w-24 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
             {/* Left: Founder Card */}
             <div className="bg-white rounded-3xl shadow-xl p-8 border border-stone-100 relative overflow-visible group hover:shadow-2xl transition duration-500 transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <HeartHandshake className="w-40 h-40 text-emerald-900 rotate-12" />
                </div>
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                   <div className="relative">
                     <div className="h-32 w-32 rounded-full bg-emerald-50 overflow-hidden flex-shrink-0 border-4 border-white shadow-lg ring-1 ring-stone-200 group-hover:ring-emerald-400 transition-all duration-500 flex items-center justify-center">
                        {/* 
                          ------------------------------------------------
                          --- FOUNDER LOGO (User SVG) ---
                          ------------------------------------------------
                        */}
                        <div className="h-full w-full flex items-center justify-center bg-stone-100 text-stone-400">
                          <User className="h-20 w-20" />
                        </div>
                     </div>
                     <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm" title="Developer">
                        <User className="w-4 h-4" />
                     </div>
                   </div>
                   
                   <div className="text-center sm:text-left pt-2">
                      <h3 className="text-2xl font-bold text-slate-900">Abhishek SK</h3>
                      <p className="text-emerald-600 font-bold mb-2">Lead Developer & Founder</p>
                      
                      {/* HIGHLIGHTED DSCASC */}
                      <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 shadow-sm">
                         <p className="text-emerald-800 text-sm font-extrabold tracking-wide">DSCASC</p>
                      </div>
                   </div>
                </div>

                <div className="relative mb-6">
                  <div className="absolute -left-2 -top-2 text-emerald-200 text-4xl font-serif">"</div>
                  <p className="text-slate-600 leading-relaxed italic text-lg px-4">
                     A tech enthusiast passionate about using software to solve social inequalities. Built MealBridge as a final project to demonstrate how code can feed the hungry.
                  </p>
                  <div className="absolute -right-1 bottom-0 text-emerald-200 text-4xl font-serif">"</div>
                </div>

                {/* SOCIAL MEDIA - INSTAGRAM & YOUTUBE */}
                <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start">
                  <a 
                    href="https://www.instagram.com/abhisheksks?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>@abhisheksks</span>
                  </a>
                  <a 
                    href="https://youtube.com/@maahi_s_k_?si=AVSuBHLr0qzh12Ef" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-600 text-white font-bold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>Maahi S K</span>
                  </a>
                </div>
             </div>

             {/* Right: Mission */}
             <div className="space-y-10 pl-0 md:pl-8">
                <div className="flex items-start group">
                   <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-600 transform group-hover:rotate-6 transition duration-300 shadow-sm">
                         <ShieldCheck className="h-7 w-7" />
                      </div>
                   </div>
                   <div className="ml-6">
                      <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition">Our Mission</h4>
                      <p className="text-slate-600 leading-relaxed">
                         MealBridge connects local food donors with shelters in real-time to eliminate food waste. We believe that technology is at its best when it serves humanity.
                      </p>
                   </div>
                </div>
                
                <div className="flex items-start group">
                   <div className="flex-shrink-0 mt-1">
                      <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-2xl bg-amber-100 text-amber-600 transform group-hover:-rotate-6 transition duration-300 shadow-sm">
                         <MapPin className="h-7 w-7" />
                      </div>
                   </div>
                   <div className="ml-6">
                      <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition">Zero Waste Network</h4>
                      <p className="text-slate-600 leading-relaxed">
                         By simplifying the donation process, we aim to create a city with Zero Hunger and Zero Food Waste. We optimize logistics so food travels fast.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-emerald-500/10 p-2 rounded-full mr-3">
              <HeartHandshake className="h-6 w-6 text-emerald-500" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight">MealBridge</span>
          </div>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Connecting communities, one meal at a time. Join us in our mission to eradicate hunger through technology.
          </p>
          <div className="h-px w-24 bg-slate-800 mx-auto mb-6"></div>
          <p className="text-slate-500 text-sm">
            Made with ❤️ at <span className="text-emerald-400 font-bold hover:text-emerald-300 transition cursor-default">DSCASC</span><br/>
            (Dayananda Sagar College of Arts, Science and Commerce)<br/>
            by <span className="text-white font-semibold inline-flex items-center ml-1">
              Abhishek SK
              <User className="h-3 w-3 ml-1 text-slate-400" />
            </span>
          </p>
          <div className="mt-6 flex justify-center space-x-4">
             <a href="https://www.instagram.com/abhisheksks?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition">
                <Instagram className="h-5 w-5" />
             </a>
             <a href="https://youtube.com/@maahi_s_k_?si=AVSuBHLr0qzh12Ef" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-500 transition">
                <Youtube className="h-5 w-5" />
             </a>
          </div>
          <p className="text-slate-700 text-xs mt-4">&copy; {new Date().getFullYear()} MealBridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// 3. Donor Dashboard
const DonorDashboard = () => {
  const { donations, addDonation, updateDonationStatus, isLoading, userProfile, userLocation, updateProfile } = useStore();
  const [formData, setFormData] = useState({
    food_title: '',
    category: 'Cooked Meals' as FoodCategory,
    quantity: '',
    pickup_address: '',
    best_before_time: '',
    // Vegetarian default image (Salad bowl)
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
  });
  const [activeTab, setActiveTab] = useState<'donate' | 'history'>('donate');
  const [contactInput, setContactInput] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Store full location objects for filtering
  const [filteredSuggestions, setFilteredSuggestions] = useState<{label: string, lat: number, lng: number}[]>([]);
  // Track currently selected coordinates from dropdown
  const [selectedCoordinates, setSelectedCoordinates] = useState<{lat: number, lng: number} | null>(null);
  
  // Track if location is from GPS or Manual
  const [isUsingGPS, setIsUsingGPS] = useState(false);
  
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Prompt for contact if missing
  const isContactMissing = !userProfile?.contact;

  const handleUpdateContact = (e: React.FormEvent) => {
      e.preventDefault();
      if(contactInput) {
          updateProfile({ contact: contactInput });
      }
  };
  
  // Handlers for Form Data
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value;
      setFormData(prev => ({
          ...prev,
          food_title: title,
          // Automatically set relevant vegetarian image
          image_url: getRelevantFoodImage(title, prev.category)
      }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const category = e.target.value as FoodCategory;
      setFormData(prev => ({
          ...prev,
          category,
          image_url: getRelevantFoodImage(prev.food_title, category)
      }));
  };
  
  // Address Change Handler with Autocomplete logic
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setFormData(prev => ({ ...prev, pickup_address: val }));
      
      // Reset GPS/Coordinates flags when typing manually
      setIsUsingGPS(false);
      setSelectedCoordinates(null);

      // Filter suggestions
      if (val.length > 2) {
          const matched = MOCK_LOCATIONS.filter(loc => 
              loc.label.toLowerCase().includes(val.toLowerCase())
          );
          setFilteredSuggestions(matched);
          setShowSuggestions(matched.length > 0);
      } else {
          setShowSuggestions(false);
      }
  };
  
  const selectSuggestion = (loc: {label: string, lat: number, lng: number}) => {
      setFormData(prev => ({ ...prev, pickup_address: loc.label }));
      setSelectedCoordinates({ lat: loc.lat, lng: loc.lng }); // Store exact coordinates
      setShowSuggestions(false);
      setIsUsingGPS(false);
  };

  const handleUseLocation = () => {
     if (userLocation) {
         setFormData(prev => ({
             ...prev,
             pickup_address: "Current Location (Detected via GPS)"
         }));
         setIsUsingGPS(true); // Flag to use accurate GPS coords
         setSelectedCoordinates(null);
         setShowSuggestions(false);
     }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
             setShowSuggestions(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(isContactMissing) {
        alert("Please add your contact number in the alert box above to continue.");
        return;
    }
    
    // Determine Lat/Lng
    let lat = 12.9716; // Default Bangalore Center
    let lng = 77.5946;
    
    if (selectedCoordinates) {
        // Priority 1: User selected a specific suggested location with known coordinates
        lat = selectedCoordinates.lat;
        lng = selectedCoordinates.lng;
    } else if (isUsingGPS && userLocation) {
        // Priority 2: User explicitly clicked "Use My Location"
        lat = userLocation.lat;
        lng = userLocation.lng;
    } else if (userLocation) {
        // Priority 3: User typed manually but didn't pick a suggestion.
        lat = userLocation.lat;
        lng = userLocation.lng;
    }
    
    addDonation({
      food_title: formData.food_title,
      category: formData.category,
      quantity: formData.quantity,
      pickup_address: formData.pickup_address,
      best_before: new Date(Date.now() + parseInt(formData.best_before_time || '4') * 3600000).toISOString(),
      image_url: formData.image_url,
      latitude: lat,
      longitude: lng,
    });
    
    // Reset form but keep address/image for demo ease
    setFormData(prev => ({ 
        ...prev, 
        food_title: '', 
        quantity: '', 
        best_before_time: '',
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop' // Reset to Salad
    }));
    
    // Show Thank You Modal
    setShowThankYou(true);
  };

  const closeThankYou = () => {
      setShowThankYou(false);
      setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 relative">
      
      {/* THANK YOU MODAL */}
      {showThankYou && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
              <Confetti />
              
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center transform scale-100 transition-all border border-emerald-100 relative overflow-hidden z-[85]">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                  
                  <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-50 mb-6 relative animate-bounce-in">
                      <div className="absolute -top-3 -right-3 text-4xl animate-pulse">🎉</div>
                      <div className="absolute -bottom-1 -left-3 text-3xl animate-pulse delay-75">✨</div>
                      <HeartHandshake className="h-12 w-12 text-emerald-600" />
                  </div>
                  
                  <h3 className="text-3xl font-heading font-bold text-slate-900 mb-2">Congratulations!</h3>
                  <p className="text-emerald-600 font-bold mb-6 text-lg">You've successfully shared a meal.</p>
                  
                  <div className="bg-stone-50 p-6 rounded-2xl mb-8 relative">
                      <div className="absolute -top-3 left-4 text-emerald-300 text-4xl leading-none font-serif">"</div>
                      <p className="text-slate-600 italic leading-relaxed text-lg">
                        Your kindness is the sunshine in someone's cloudy day. Thank you for making a difference.
                      </p>
                      <div className="absolute -bottom-3 right-4 text-emerald-300 text-4xl leading-none font-serif rotate-180">"</div>
                  </div>
                  
                  <div className="w-full">
                    <button 
                        onClick={closeThankYou}
                        className="w-full py-3.5 rounded-xl bg-white text-emerald-700 border-2 border-emerald-100 font-bold hover:bg-emerald-50 transition flex items-center justify-center"
                    >
                        View History
                    </button>
                  </div>
              </div>
          </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl font-heading font-bold text-slate-900">Donor Dashboard</h1>
             <p className="text-slate-500 mt-1">Welcome, <span className="text-emerald-600 font-semibold">{userProfile?.name || 'Restaurant Partner'}</span></p>
          </div>
          <div className="flex bg-white rounded-lg p-1.5 shadow-sm border border-stone-200">
            <button 
              onClick={() => setActiveTab('donate')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'donate' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-stone-50'}`}
            >
              New Donation
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'history' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-stone-50'}`}
            >
              History
            </button>
          </div>
        </div>

        {/* MISSING CONTACT ALERT */}
        {isContactMissing && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-sm animate-fade-in">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3 w-full">
                        <p className="text-sm text-amber-700 font-bold">
                            Missing Contact Information
                        </p>
                        <p className="text-sm text-amber-600 mt-1">
                            Please add your phone number so NGOs can reach you when they claim your food.
                        </p>
                        <form onSubmit={handleUpdateContact} className="mt-3 flex gap-2">
                            <input 
                                type="tel" 
                                placeholder="+91 99999 99999" 
                                className="px-3 py-1.5 rounded border border-amber-300 text-sm w-full max-w-xs focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 bg-white" // Fixed visibility
                                value={contactInput}
                                onChange={(e) => setContactInput(e.target.value)}
                                required
                            />
                            <button type="submit" className="bg-amber-500 text-white px-3 py-1.5 rounded text-sm font-bold hover:bg-amber-600 transition">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'donate' ? (
          <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden">
            <div className="bg-emerald-600 p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                <HeartHandshake className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-white font-bold text-xl flex items-center relative z-10">
                <Heart className="mr-2 h-5 w-5 fill-emerald-500 text-emerald-100" /> Post a Donation
              </h2>
              <p className="text-emerald-100 text-sm mt-1 relative z-10">Details help NGOs find your food quickly.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Food Title</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none shadow-sm"
                    placeholder="e.g., Vegetable Stir Fry, Rice, Bread"
                    value={formData.food_title}
                    onChange={handleTitleChange}
                  />
                  {/* PREVIEW REMOVED AS REQUESTED */}
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                   <select 
                      value={formData.category}
                      onChange={handleCategoryChange}
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none shadow-sm cursor-pointer"
                   >
                      <option value="Cooked Meals">Cooked Meals (Veg)</option>
                      <option value="Raw Produce">Raw Produce</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Grains">Grains</option>
                      <option value="Bakery">Bakery</option>
                      <option value="Other">Other</option>
                   </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Quantity</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none shadow-sm"
                    placeholder="e.g., 20 servings, 5 kg"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Best Before (Hours from now)</label>
                  <input 
                    required
                    type="number" 
                    min="1"
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none shadow-sm"
                    placeholder="e.g., 4"
                    value={formData.best_before_time}
                    onChange={e => setFormData({...formData, best_before_time: e.target.value})}
                  />
                </div>
              </div>

              <div ref={addressInputRef} className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-2">Pickup Address</label>
                <div className="flex gap-2">
                    <div className="relative flex-grow">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <input 
                            required
                            type="text" 
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none shadow-sm"
                            placeholder="Enter full address or area name"
                            value={formData.pickup_address}
                            onChange={handleAddressChange}
                            onFocus={(e) => {
                                if(e.target.value.length > 2) setShowSuggestions(true);
                            }}
                        />
                        {/* AUTOCOMPLETE DROPDOWN */}
                        {showSuggestions && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                {filteredSuggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 text-sm text-slate-700 border-b border-stone-100 last:border-0 flex items-center"
                                        onClick={() => selectSuggestion(suggestion)}
                                    >
                                        <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                        {suggestion.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button 
                        type="button"
                        onClick={handleUseLocation}
                        className={`font-bold px-4 rounded-lg border transition flex items-center whitespace-nowrap ${
                            isUsingGPS 
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title="Use my current location"
                    >
                        <MapPin className="w-5 h-5 mr-1" />
                        {isUsingGPS ? 'Location Set' : 'Use My Location'}
                    </button>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading || isContactMissing}
                  className="w-full bg-emerald-600 text-white font-bold py-4 rounded-full hover:bg-emerald-700 transition transform active:scale-[0.99] shadow-lg flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : 'Post Donation'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
             {donations.filter(d => d.donor_id === 'currentUser' || d.donor_id === userProfile?.id || d.donor_id === 'd1').length === 0 ? (
               <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-300">
                  <Leaf className="mx-auto h-12 w-12 text-stone-300 mb-3" />
                  <h3 className="text-lg font-medium text-slate-900">No donations yet</h3>
                  <p className="text-slate-400">Your donation history will appear here.</p>
               </div>
             ) : (
               donations.filter(d => d.donor_id === 'currentUser' || d.donor_id === userProfile?.id || d.donor_id === 'd1').map(donation => (
                 <div key={donation.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col md:flex-row justify-between items-start transition hover:shadow-md">
                    <div className="flex items-center space-x-5 mb-4 md:mb-0 w-full md:w-auto">
                       <img 
                          src={donation.image_url} 
                          alt="Food" 
                          className="h-20 w-20 rounded-xl object-cover shadow-sm"
                          onError={handleImageError}
                        />
                       <div>
                          <h3 className="font-bold text-slate-900 text-lg">{donation.food_title}</h3>
                          <p className="text-sm text-slate-500 font-medium">{donation.quantity} &bull; <span className="text-slate-400 font-normal">Posted {new Date(donation.created_at).toLocaleDateString()}</span></p>
                          
                          {/* SHOW CLAIMER INFO IF RESERVED */}
                          {donation.status === 'reserved' && donation.claimedBy && (
                              <div className="mt-3 bg-emerald-50/80 p-3 rounded-lg border border-emerald-100 text-sm max-w-sm">
                                <p className="font-bold text-emerald-800 text-xs uppercase tracking-wide mb-1">Claimed By</p>
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center">
                                    <User className="w-3.5 h-3.5 mr-2 text-emerald-600"/>
                                    <span className="text-slate-800 font-medium">{donation.claimedBy.name}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Phone className="w-3.5 h-3.5 mr-2 text-emerald-600"/>
                                    <a href={`tel:${donation.claimedBy.contact}`} className="text-slate-600 hover:text-emerald-700 hover:underline">{donation.claimedBy.contact}</a>
                                  </div>
                                </div>
                              </div>
                          )}
                       </div>
                    </div>
                    
                    {/* STATUS ACTIONS */}
                    <div className="w-full md:w-auto flex flex-col items-end gap-3">
                       <span className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize flex items-center ${
                         donation.status === 'reserved' 
                           ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                           : donation.status === 'picked_up'
                           ? 'bg-stone-100 text-stone-600 border border-stone-200'
                           : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                       }`}>
                         <span className={`w-2 h-2 rounded-full mr-2 ${
                            donation.status === 'reserved' ? 'bg-amber-500' :
                            donation.status === 'picked_up' ? 'bg-stone-500' : 'bg-emerald-500'
                         }`}></span>
                         {donation.status === 'picked_up' ? 'Picked Up' : donation.status}
                       </span>

                       {/* CONFIRM PICKUP BUTTONS */}
                       {donation.status === 'reserved' && (
                           <button 
                             onClick={() => updateDonationStatus(donation.id, 'picked_up')}
                             className="flex items-center px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition shadow-sm"
                           >
                             <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                             Confirm Pickup
                           </button>
                       )}
                       
                       {donation.status === 'available' && (
                           <button 
                             onClick={() => updateDonationStatus(donation.id, 'picked_up')}
                             className="flex items-center px-3 py-1.5 text-xs font-bold text-slate-500 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:text-slate-700 transition"
                             title="Mark as given offline"
                           >
                             <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                             Mark Picked Up
                           </button>
                       )}
                    </div>
                 </div>
               ))
             )}
          </div>
        )}
      </div>
    </div>
  );
};

// 4. NGO Dashboard
const NGODashboard = () => {
  const { donations, claimDonation, userProfile, userLocation } = useStore();
  const [filter, setFilter] = useState<'all' | 'veg' | 'near'>('all');
  const [activeTab, setActiveTab] = useState<'find' | 'claims'>('find');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  
  // Claim Modal State
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimName, setClaimName] = useState('');
  const [claimContact, setClaimContact] = useState('');

  const filteredDonations = donations.filter(d => {
    // Only show available donations in list mode (standard), but in map mode show everything available
    if (d.status !== 'available') return false;
    
    // Veg Check (Simple heuristic based on title/category logic)
    if (filter === 'veg') {
         const t = d.food_title.toLowerCase();
         // Exclude common non-veg terms
         const nonVeg = ['chicken', 'mutton', 'fish', 'egg', 'meat', 'beef', 'pork'];
         return !nonVeg.some(term => t.includes(term)) && d.category !== 'Other'; // 'Other' could be anything
    }
    
    // Near Check
    if (filter === 'near') {
        return d.distance !== undefined && d.distance < 5.0;
    }
    
    return true;
  });

  // Filter My Claims - Updated to match by ID strictly, then fallback to name
  const myClaims = donations.filter(d => {
      if (d.status !== 'reserved' && d.status !== 'picked_up') return false;
      
      // Strict match using ID if available
      if (d.claimedBy?.id && userProfile?.id) {
          return d.claimedBy.id === userProfile.id;
      }
      
      // Fallback match using Name (legacy/mock compatibility)
      return d.claimedBy?.name === (userProfile?.name || 'NGO Partner');
  });

  // SPLIT CLAIMS FOR BETTER UI
  const activeClaims = myClaims.filter(d => d.status === 'reserved');
  const pastClaims = myClaims.filter(d => d.status === 'picked_up');

  const initiateClaim = (id: string) => {
      setClaimingId(id);
      // Default to user profile name for smoother UX
      setClaimName(userProfile?.name || '');
      setClaimContact(userProfile?.contact || '');
      setClaimModalOpen(true);
  };

  const confirmClaim = (e: React.FormEvent) => {
     e.preventDefault();
     if (claimingId && claimName && claimContact) {
         const claimer = {
             name: claimName,
             contact: claimContact,
             id: userProfile?.id // Pass current user ID
         };
         claimDonation(claimingId, claimer);
         setClaimModalOpen(false);
         setClaimingId(null);
         alert("Thank you! The donation has been reserved. Please check 'My Claims' for details.");
         setActiveTab('claims');
     }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      {/* CLAIM CONFIRMATION MODAL */}
      {claimModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                  <div className="bg-amber-500 p-4 flex justify-between items-center">
                      <h3 className="text-white font-bold flex items-center"><ShieldCheck className="w-5 h-5 mr-2" /> Confirm Claim</h3>
                      <button onClick={() => setClaimModalOpen(false)} className="text-amber-100 hover:text-white"><X className="w-6 h-6"/></button>
                  </div>
                  <form onSubmit={confirmClaim} className="p-6">
                      <p className="text-sm text-slate-600 mb-4">Please confirm your details so the donor knows who is coming.</p>
                      
                      <div className="mb-4">
                          <label className="block text-sm font-bold text-slate-700 mb-1">Foundation / Organization Name</label>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <input 
                                type="text" 
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none" // Fixed visibility
                                value={claimName}
                                onChange={(e) => setClaimName(e.target.value)}
                                placeholder="e.g. Tata Foundation"
                                required
                            />
                          </div>
                      </div>

                      <div className="mb-6">
                          <label className="block text-sm font-bold text-slate-700 mb-1">Contact Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <input 
                                type="tel" 
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none" // Fixed visibility
                                value={claimContact}
                                onChange={(e) => setClaimContact(e.target.value)}
                                placeholder="+91 99999 99999"
                                required
                            />
                          </div>
                      </div>

                      <div className="flex justify-end gap-3">
                          <button 
                            type="button" 
                            onClick={() => setClaimModalOpen(false)}
                            className="px-4 py-2 text-slate-500 hover:bg-stone-100 rounded-lg font-bold"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit"
                            className="px-6 py-2 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 shadow-md"
                          >
                            Claim Now
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
           <div>
               <h1 className="text-3xl font-heading font-bold text-slate-900">NGO Dashboard</h1>
               <p className="text-slate-500 mt-1">Welcome, <span className="text-emerald-600 font-semibold">{userProfile?.name || 'Partner'}</span></p>
           </div>
           
           <div className="flex bg-white rounded-lg p-1 shadow-sm border border-stone-200 mt-4 md:mt-0">
               <button onClick={() => setActiveTab('find')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'find' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-stone-50'}`}>Find Food</button>
               <button onClick={() => setActiveTab('claims')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'claims' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-stone-50'}`}>My Claims</button>
           </div>
        </div>

        {activeTab === 'find' ? (
            <>
                {/* FILTERS & VIEW TOGGLE */}
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <div className="flex gap-2">
                        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${filter === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>All Items</button>
                        <button onClick={() => setFilter('near')} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${filter === 'near' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>Nearby (&lt; 5km)</button>
                        <button onClick={() => setFilter('veg')} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${filter === 'veg' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>Veg Only</button>
                    </div>

                    <div className="flex bg-white rounded-lg border border-stone-200 p-0.5">
                        <button 
                            onClick={() => setViewMode('list')} 
                            className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                            title="List View"
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setViewMode('map')} 
                            className={`p-1.5 rounded-md transition ${viewMode === 'map' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Map View"
                        >
                            <MapIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {viewMode === 'map' ? (
                    <MapView 
                        donations={filteredDonations}
                        userLocation={userLocation}
                        onClaim={initiateClaim}
                    />
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                    {filteredDonations.length === 0 ? (
                        <div className="col-span-full text-center py-20">
                            <div className="bg-white p-8 rounded-2xl inline-block shadow-sm border border-stone-100">
                                <Smile className="h-12 w-12 text-stone-300 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-slate-700">No donations found</h3>
                                <p className="text-slate-400">Try changing your filters.</p>
                            </div>
                        </div>
                    ) : (
                        filteredDonations.map(donation => (
                            <div key={donation.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-lg transition group flex flex-col">
                                <div className="h-48 relative overflow-hidden">
                                    <img 
                                        src={donation.image_url} 
                                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition duration-700"
                                        alt={donation.food_title}
                                        onError={handleImageError}
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-700 text-xs font-bold px-2 py-1 rounded-lg shadow-sm flex items-center">
                                        <Clock className="w-3 h-3 mr-1 text-emerald-500" />
                                        Use by {new Date(donation.best_before).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                    <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                                        {donation.category}
                                    </div>
                                    {donation.distance !== undefined && (
                                        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center">
                                            <MapPin className="w-3 h-3 mr-1 text-emerald-400" />
                                            {donation.distance.toFixed(1)} km away
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-grow flex flex-col">
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{donation.food_title}</h3>
                                        <p className="text-sm text-slate-500 mb-4">{donation.pickup_address}</p>
                                        
                                        <div className="flex items-center justify-between text-sm text-slate-600 bg-stone-50 p-3 rounded-lg border border-stone-100 mb-4">
                                            <span className="flex items-center"><List className="w-4 h-4 mr-2 text-slate-400"/> {donation.quantity}</span>
                                            <span className="flex items-center"><User className="w-4 h-4 mr-2 text-slate-400"/> {donation.donor_name}</span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => initiateClaim(donation.id)}
                                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-md shadow-emerald-100 flex items-center justify-center group-hover:shadow-emerald-200"
                                    >
                                        Claim Donation
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                    </div>
                )}
            </>
        ) : (
            // MY CLAIMS TAB
            <div className="space-y-8">
                {myClaims.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-300">
                        <List className="mx-auto h-12 w-12 text-stone-300 mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No active claims</h3>
                        <p className="text-slate-400">Claim donations from the "Find Food" tab to see them here.</p>
                    </div>
                ) : (
                   <>
                    {/* ACTIVE CLAIMS */}
                    {activeClaims.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center mb-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                                Active Reservations
                            </h3>
                            {activeClaims.map(donation => (
                                <div key={donation.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-6 transition hover:shadow-md border-l-4 border-l-amber-500">
                                    <div className="flex-shrink-0 relative">
                                        <img 
                                            src={donation.image_url} 
                                            alt="Food" 
                                            className="h-24 w-24 rounded-xl object-cover object-center shadow-sm"
                                            onError={handleImageError}
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-xl">{donation.food_title}</h3>
                                                <p className="text-slate-500 font-medium">{donation.quantity}</p>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-100 text-amber-600">
                                                Reserved
                                            </span>
                                        </div>

                                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-100">
                                                <p className="text-xs font-bold uppercase tracking-wide mb-2 text-emerald-800">Donor Contact</p>
                                                <div className="flex items-center mb-1">
                                                    <User className="w-4 h-4 mr-2 text-emerald-600" />
                                                    <span className="font-bold text-slate-700">{donation.donor_name}</span>
                                                </div>
                                                {donation.donor_contact ? (
                                                    <div className="flex items-center">
                                                        <Phone className="w-4 h-4 mr-2 text-emerald-600" />
                                                        <a href={`tel:${donation.donor_contact}`} className="text-emerald-700 font-bold hover:underline">{donation.donor_contact}</a>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-400 italic">Contact hidden</p>
                                                )}
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Pickup Location</p>
                                                <p className="text-sm text-slate-700 font-medium mb-3">{donation.pickup_address}</p>
                                                <a 
                                                    href={`https://www.google.com/maps/search/?api=1&query=${donation.latitude},${donation.longitude}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm"
                                                >
                                                    <Navigation className="w-3.5 h-3.5 mr-1.5" />
                                                    Navigate
                                                    <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* HISTORY */}
                    {pastClaims.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-stone-200">
                            <h3 className="font-bold text-slate-500 text-lg flex items-center mb-2">
                                <History className="w-5 h-5 mr-2" />
                                Claim History
                            </h3>
                            {pastClaims.map(donation => (
                                <div key={donation.id} className="bg-stone-50 p-6 rounded-2xl border border-stone-200 flex flex-col md:flex-row gap-6 opacity-90 hover:opacity-100 transition">
                                    <div className="flex-shrink-0 relative">
                                        <img 
                                            src={donation.image_url} 
                                            alt="Food" 
                                            className="h-20 w-20 rounded-xl object-cover object-center shadow-sm grayscale-[30%]"
                                            onError={handleImageError}
                                        />
                                        <div className="absolute inset-0 bg-stone-900/10 flex items-center justify-center rounded-xl">
                                            <CheckCircle className="text-white w-8 h-8 drop-shadow-lg" />
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-slate-700 text-lg">{donation.food_title}</h3>
                                                <p className="text-slate-500 font-medium text-sm">{donation.quantity}</p>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-stone-200 text-stone-600">
                                                Picked Up
                                            </span>
                                        </div>
                                        <div className="mt-2 text-sm text-slate-500 flex gap-4">
                                            <span className="flex items-center"><User className="w-3 h-3 mr-1"/> {donation.donor_name}</span>
                                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {donation.pickup_address}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                   </>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

// 5. Main App Component
const AppContent = () => {
  const { userRole } = useStore();
  const [currentPage, setCurrentPage] = useState('landing');
  const [showLogin, setShowLogin] = useState(false);
  const [loginRole, setLoginRole] = useState<'donor' | 'ngo' | null>(null);

  // Sync route with auth state
  useEffect(() => {
    if (userRole === 'donor') setCurrentPage('donor');
    else if (userRole === 'ngo') setCurrentPage('ngo');
    else setCurrentPage('landing');
  }, [userRole]);

  const handleLoginClick = (role: 'donor' | 'ngo') => {
    setLoginRole(role);
    setShowLogin(true);
  };

  const handleNavigate = (page: string) => {
    if (page === 'landing' && userRole) {
       // If logged in, navigate to dashboard instead of landing
       if (userRole === 'donor') setCurrentPage('donor');
       else setCurrentPage('ngo');
    } else {
       setCurrentPage(page);
    }
  };

  return (
    <>
      <Navbar onNavigate={handleNavigate} onLoginClick={handleLoginClick} />
      
      <main className="pt-0 animate-fade-in">
        {currentPage === 'landing' && <LandingPage onLoginClick={handleLoginClick} />}
        {currentPage === 'donor' && <DonorDashboard />}
        {currentPage === 'ngo' && <NGODashboard />}
      </main>

      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        targetRole={loginRole} 
      />
    </>
  );
};

const App = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;