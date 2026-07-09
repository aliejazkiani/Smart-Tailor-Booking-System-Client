import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  MapPin,
  Navigation,
  CornerUpRight,
  Map as MapIcon,
  List as ListIcon,
  Heart,
  MessageCircle,
  Scissors,
  Tag,
  Loader2,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import API from "../utils/api";

// --- Leaflet Icon Fix ---
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Safety Helper (Fixes NaN Errors) ---
const isValidCoords = (coords) => {
  return (
    Array.isArray(coords) &&
    coords.length === 2 &&
    typeof coords[0] === 'number' && !isNaN(coords[0]) &&
    typeof coords[1] === 'number' && !isNaN(coords[1])
  );
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getShopStatus = () => {
  const hour = new Date().getHours();
  return hour >= 10 && hour < 22 ? "Open Now" : "Closed";
};

// --- FlyTo Animation Component (Fixed NaN Check) ---
function FlyToLocation({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (isValidCoords(center)) {
      map.flyTo(center, zoom, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [center, zoom, map]);
  return null;
}

// --- Skeleton Loading Component ---
const SkeletonCard = () => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 animate-pulse flex gap-4 w-full">
    <div className="w-24 h-32 bg-gray-200 rounded-xl shrink-0"></div>
    <div className="flex-1 space-y-3 py-1">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="flex gap-2 pt-4">
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  </div>
);

const ShopFinder = () => {
  const navigate = useNavigate();
  const ISLAMABAD_DEFAULT = [33.6844, 73.0479];

  // State
  const [userLocation, setUserLocation] = useState(ISLAMABAD_DEFAULT);
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("tailorFavorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("distance");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [mapCenter, setMapCenter] = useState(ISLAMABAD_DEFAULT);
  const [mapZoom, setMapZoom] = useState(13);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [showMapMobile, setShowMapMobile] = useState(false);

  useEffect(() => {
    localStorage.setItem("tailorFavorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchTailors = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/tailor/all").catch(() => ({
          data: [],
        }));

        // FULL Dummy Data Restored
        const dummyData = [
          { _id: "1", shopName: "Master Stitchers", category: ["Men", "Suit"], rating: 4.8, reviews: 120, location: [33.7215, 73.0586], address: "Blue Area, Islamabad", status: getShopStatus(), phone: "923001234567", startPrice: "2500", services: ["Suit"], image: "https://images.unsplash.com/photo-1596813355026-640a3d5483f9?w=500" },
          { _id: "2", shopName: "Modern Strikers", category: ["Women", "Suit"], rating: 4.0, reviews: 10, location: [33.6939, 73.0507], address: "G-8, Islamabad", status: getShopStatus(), phone: "923001234567", startPrice: "2500", services: ["Suit"], image: "https://images.unsplash.com/photo-1596813355026-640a3d5483f9?w=500" },
          { _id: "3", shopName: "Elegant Boutique", category: ["Women", "Bridal"], rating: 4.7, reviews: 80, location: [33.7284, 73.0479], address: "F-7 Markaz, Islamabad", status: "Closed", phone: "923007654321", startPrice: "3500", services: ["Bridal"], image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500" },
          { _id: "4", shopName: "Master Ali Ejaz Tailors", category: ["Gents", "All"], rating: 5.0, reviews: 999, location: [33.731, 73.0603], address: "F-6 Markaz Islamabad", status: getShopStatus(), phone: "923001234567", startPrice: "5000", services: ["Suit"], image: "https://images.unsplash.com/photo-1596813355026-640a3d5483f9?w=500" },
          { _id: "5", shopName: "Hakeem Luqman Tailors", category: ["Women", "All"], rating: 1.0, reviews: 1, location: [33.7496, 73.0892], address: "E-7 Markaz, Islamabad", status: "Closed", phone: "923007654321", startPrice: "5000", services: ["Bridal"], image: "https://via.placeholder.com/150" },
          { _id: "6", shopName: "Allure Fashions", category: ["Men", "All"], rating: 3.5, reviews: 85, location: [33.6486, 73.0816], address: "Dhoke Kala Khan, Rawalpindi", status: "Closed", phone: "923007654321", startPrice: "3500", services: ["Bridal"], image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500" },
          { _id: "7", shopName: "Quick Alterations", category: ["Alterations", "Casual"], rating: 4.2, reviews: 435, location: [33.687, 73.0336], address: "G-9 Karachi Company, Islamabad", status: getShopStatus(), phone: "923331122334", startPrice: "500", services: ["Hemming"], image: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?w=500" },
          { _id: "8", shopName: "New Modern Strikers", category: ["Men", "Suit"], rating: 3.99, reviews: 40, location: [33.6939, 73.0507], address: "G-6, Islamabad", status: getShopStatus(), phone: "923001234567", startPrice: "2500", services: ["Suit"], image: "https://images.unsplash.com/photo-1596813355026-640a3d5483f9?w=500" },
        ];

        const formattedAPI = (data || []).map((t) => {
          let loc = ISLAMABAD_DEFAULT;
          if (t.location?.coordinates?.length === 2) {
            const lat = parseFloat(t.location.coordinates[1]);
            const lng = parseFloat(t.location.coordinates[0]);
            if (!isNaN(lat) && !isNaN(lng)) loc = [lat, lng];
          }

          return {
            _id: t._id,
            shopName: t.shopName || t.fullName || "Unnamed Shop",
            category: t.specialization ? [t.specialization] : ["General"],
            rating: t.rating || 0,
            reviews: t.reviews || 0,
            location: loc,
            address: t.shopAddress || "Address unavailable",
            status: t.status || "Open Now",
            phone: t.phone || "",
            startPrice: t.startPrice || "1000",
            services: t.services || ["General"],
            image: t.profileImage || "https://via.placeholder.com/150",
          };
        });

        const merged = [...dummyData];
        formattedAPI.forEach((apiTailor) => {
          if (!merged.find((t) => t._id === apiTailor._id)) merged.push(apiTailor);
        });

        setTailors(merged);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTailors();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const loc = [position.coords.latitude, position.coords.longitude];
        if (isValidCoords(loc)) {
          setUserLocation(loc);
          setMapCenter(loc);
        }
      });
    }
  }, []);

  const processedTailors = useMemo(() => {
    const tailorsWithDist = tailors.map((t) => ({
      ...t,
      distance: calculateDistance(
        userLocation[0],
        userLocation[1],
        t.location[0],
        t.location[1],
      ),
    }));

    const filtered = tailorsWithDist.filter((t) => {
      const matchesCategory = categoryFilter === "All" || t.category.includes(categoryFilter);
      const matchesSearch = t.shopName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFav = showFavoritesOnly ? favorites.includes(t._id) : true;
      return matchesCategory && matchesSearch && matchesFav;
    });

    return filtered.sort((a, b) =>
      sortBy === "rating" ? b.rating - a.rating : a.distance - b.distance,
    );
  }, [tailors, categoryFilter, searchQuery, userLocation, sortBy, favorites, showFavoritesOnly]);

  // Actions
  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };
  
  const handleWhatsApp = (e, phone) => {
    e.stopPropagation();
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  const handleDirection = (e, loc) => {
    e.stopPropagation();
    if (isValidCoords(loc)) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc[0]},${loc[1]}`, "_blank");
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-slate-50 overflow-hidden font-sans">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .leaflet-container { height: 100% !important; width: 100% !important; z-index: 1; }
      `}</style>

      {/* --- HEADER --- */}
      <header className="bg-slate-900 text-white shrink-0 shadow-lg">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Scissors className="text-indigo-400 w-5 h-5" />
                <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-indigo-300">Smart Tailor Network</span>
              </div>
              <h1 className="text-xl md:text-3xl font-black tracking-tight">Shop Finder</h1>
            </div>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-bold ${showFavoritesOnly ? "bg-pink-600 border-pink-500 text-white" : "bg-white/10 border-white/20 hover:bg-white/20"}`}
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{showFavoritesOnly ? "Show All" : "Favorites"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-h-0 container mx-auto px-0 md:px-4">
        {/* FILTERS */}
        <div className="bg-white mx-4 md:mx-0 -mt-4 rounded-2xl shadow-xl border border-slate-100 p-3 md:p-4 mb-4 z-10 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text" placeholder="Search by shop name..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none border border-transparent focus:border-indigo-500 transition-all"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <select className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold px-3 py-2.5 outline-none" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Men">Men's Fashion</option>
                <option value="Women">Women's Fashion</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <select className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold px-3 py-2.5 outline-none" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="distance">Sort: Nearest</option>
                <option value="rating">Sort: Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* LAYOUT GRID */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* LIST VIEW */}
          <div className={`flex-1 md:max-w-md xl:max-w-lg flex flex-col transition-all duration-300 ${showMapMobile ? "hidden md:flex" : "flex"}`}>
            <div className="px-4 mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{processedTailors.length} tailors found</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-24 md:pb-6 space-y-4 custom-scrollbar">
              {loading ? (
                <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
              ) : processedTailors.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <Scissors className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-500 font-medium">No shops match your criteria</p>
                </div>
              ) : (
                processedTailors.map((tailor) => (
                  <div
                    key={tailor._id}
                    onClick={() => {
                      if(isValidCoords(tailor.location)) {
                        setSelectedShopId(tailor._id);
                        setMapCenter(tailor.location);
                        setMapZoom(16);
                        if (window.innerWidth < 768) setShowMapMobile(true);
                      }
                    }}
                    className={`bg-white p-3 rounded-2xl border transition-all cursor-pointer group relative ${selectedShopId === tailor._id ? "border-indigo-500 ring-4 ring-indigo-50 shadow-lg" : "border-slate-100 hover:border-indigo-200 shadow-sm"}`}
                  >
                    <button onClick={(e) => toggleFavorite(e, tailor._id)} className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-md transition-transform">
                      <Heart className={`w-4 h-4 ${favorites.includes(tailor._id) ? "fill-pink-500 text-pink-500" : "text-slate-300"}`} />
                    </button>

                    <div className="flex gap-4">
                      <div className="w-24 h-32 shrink-0 rounded-2xl overflow-hidden bg-slate-100 relative">
                        <img src={tailor.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                          {tailor.distance.toFixed(1)} km
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-bold text-slate-900 truncate text-base mb-1">{tailor.shopName}</h3>
                          <p className="text-[11px] text-slate-500 flex items-center"><MapPin className="w-3 h-3 mr-1 text-indigo-500" /> {tailor.address}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded-lg text-[10px] font-bold text-yellow-700">
                              <Star className="w-3 h-3 fill-current mr-1" /> {tailor.rating} <span className="text-slate-400 ml-1 font-normal">({tailor.reviews})</span>
                            </div>
                            <div className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-100">Rs.{tailor.startPrice}+</div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                          <button onClick={(e) => handleDirection(e, tailor.location)} className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-blue-50 transition-colors"><CornerUpRight className="w-4 h-4" /></button>
                          <button onClick={(e) => handleWhatsApp(e, tailor.phone)} className="p-2 bg-green-50 rounded-xl text-green-600 hover:bg-green-100 transition-colors"><MessageCircle className="w-4 h-4" /></button>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/book-order/${tailor._id}`); }} className="flex-1 bg-slate-900 text-white text-[11px] font-black rounded-xl hover:bg-slate-800 shadow-md">BOOK NOW</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* MAP VIEW */}
          <div className={`absolute inset-0 md:relative md:flex-1 h-full bg-slate-200 transition-all duration-500 z-0 ${showMapMobile ? "block" : "hidden md:block"}`}>
            <MapContainer center={mapCenter} zoom={mapZoom} zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <FlyToLocation center={mapCenter} zoom={mapZoom} />

              <Marker position={userLocation} icon={L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/5693/5693831.png", iconSize: [40, 40] })} />

              {processedTailors.map((tailor) => (
                isValidCoords(tailor.location) && (
                  <Marker key={tailor._id} position={tailor.location} eventHandlers={{ click: () => setSelectedShopId(tailor._id) }}>
                    <Popup className="rounded-3xl overflow-hidden">
                      <div className="w-56 overflow-hidden">
                        <img src={tailor.image} className="h-28 w-full object-cover rounded-t-xl" alt="" />
                        <div className="p-3">
                          <h4 className="font-bold text-sm text-slate-900">{tailor.shopName}</h4>
                          <div className="flex gap-2 mt-3">
                            <button onClick={(e) => handleWhatsApp(e, tailor.phone)} className="flex-1 bg-green-500 text-white p-2 rounded-xl flex justify-center"><MessageCircle size={16} /></button>
                            <button onClick={() => navigate(`/book-order/${tailor._id}`)} className="flex-[2] bg-slate-900 text-white text-[11px] font-bold rounded-xl">BOOK</button>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>

            <div className="absolute top-4 right-4 z-[400]">
              <button onClick={() => setMapCenter(userLocation)} className="bg-white p-3 rounded-2xl shadow-2xl text-slate-700 hover:text-indigo-600 border border-slate-100 transition-all active:scale-90">
                <Navigation size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE TOGGLE UI */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 px-6 z-[500]">
        <button
          onClick={() => setShowMapMobile(!showMapMobile)}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 font-bold text-xs tracking-[0.1em] active:scale-95 transition-all border border-slate-700"
        >
          {showMapMobile ? <><ListIcon size={18} /> BACK TO LIST</> : <><MapIcon size={18} /> BROWSE ON MAP</>}
        </button>
      </div>
    </div>
  );
};

export default ShopFinder;