import React, { useState, useEffect } from "react";
import { Cloud, Thermometer, Droplets, Loader2, MapPin } from "lucide-react";

// =========================================================================
// --- START: API Configuration & Data ---
// =========================================================================

// *** ACTION REQUIRED: Replace with your actual OpenWeatherMap API Key ***
const API_KEY = "82aa77cdd1f9a5d477cfc98219bc4934"; 
const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5";

// City coordinates (including latitude/longitude for API calls) and map positioning
const CITIES_DATA = [
  { city: 'Karachi', lat: 24.86, lon: 67.01, temperature: 28, humidity: 65, condition: 'Clear', icon: '01d', mapCoords: { x: 350, y: 350 } },
  { city: 'Lahore', lat: 31.55, lon: 74.34, temperature: 35, humidity: 40, condition: 'Clouds', icon: '04d', mapCoords: { x: 300, y: 200 } },
  { city: 'Islamabad', lat: 33.72, lon: 73.04, temperature: 24, humidity: 70, condition: 'Rain', icon: '10d', mapCoords: { x: 250, y: 110 } },
  { city: 'Quetta', lat: 30.18, lon: 68.00, temperature: 15, humidity: 55, condition: 'Clear', icon: '01d', mapCoords: { x: 150, y: 280 } },
  { city: 'Peshawar', lat: 34.01, lon: 71.58, temperature: 26, humidity: 50, condition: 'Clouds', icon: '04d', mapCoords: { x: 100, y: 150 } },
];
const MOCK_WEATHER_DATA = CITIES_DATA; // Mock fallback uses initial data structure

// Mock function structure for forecast (used only as fallback)
const MOCK_FETCH_FORECAST = (city) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const mockDailyData = [
        { dt: Date.now() / 1000 + 86400 * 1, temp: { min: 20, max: 30 }, weather: [{ main: 'Clear', icon: '01d' }] },
        { dt: Date.now() / 1000 + 86400 * 2, temp: { min: 22, max: 32 }, weather: [{ main: 'Clouds', icon: '04d' }] },
        { dt: Date.now() / 1000 + 86400 * 3, temp: { min: 24, max: 34 }, weather: [{ main: 'Rain', icon: '09d' }] },
        { dt: Date.now() / 1000 + 86400 * 4, temp: { min: 21, max: 31 }, weather: [{ main: 'Clear', icon: '01d' }] },
        { dt: Date.now() / 1000 + 86400 * 5, temp: { min: 19, max: 29 }, weather: [{ main: 'Snow', icon: '13d' }] },
      ];
      resolve({ daily: mockDailyData });
    }, 50); // Small delay to simulate network latency
  });
};

const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Map regions and paths
const REGIONS_DATA = [
  { id: 'Balochistan', name: 'Balochistan', color: 'bg-emerald-600', fill: '#059669', path: 'M10 380 L180 390 L200 280 L20 250 Z M180 390 L300 370 L300 280 L200 280 Z M300 280 L350 200 L200 150 L100 180 L20 250 Z' },
  { id: 'Sindh', name: 'Sindh', color: 'bg-indigo-600', fill: '#4F46E5', path: 'M300 370 L400 350 L400 280 L350 200 L300 280 Z' },
  { id: 'Punjab', name: 'Punjab', color: 'bg-amber-600', fill: '#D97706', path: 'M180 390 L300 370 L350 200 L300 100 L180 150 L150 200 L100 250 L180 390 Z' },
  { id: 'KP', name: 'Khyber Pakhtunkhwa', color: 'bg-red-600', fill: '#DC2626', path: 'M100 180 L200 150 L250 100 L180 50 L80 100 Z' },
  { id: 'ICT', name: 'Islamabad Capital Terr.', color: 'bg-sky-600', fill: '#0284C7', path: 'M250 100 L260 110 L240 120 L230 110 Z' },
  { id: 'GB', name: 'Gilgit-Baltistan', color: 'bg-pink-600', fill: '#EC4899', path: 'M180 50 L300 0 L400 0 L350 50 L250 100 Z' },
  { id: 'AJK', name: 'Azad Jammu & Kashmir', color: 'bg-fuchsia-600', fill: '#C026D3', path: 'M350 50 L450 100 L400 200 L350 200 Z M400 200 L450 100 L400 280 L350 200 Z' },
];

// =========================================================================
// --- END: API Configuration & Data ---
// =========================================================================

// Helper function to fetch CURRENT weather using the live API
const fetchLiveCurrentWeather = async (cityData) => {
  if (API_KEY === "82aa77cdd1f9a5d477cfc98219bc4934" || API_KEY === "") {
    console.warn(`API Key missing or default. Using mock data for ${cityData.city}.`);
    return cityData; // Fallback to mock data
  }
  
  try {
    const url = `${BASE_WEATHER_URL}/weather?lat=${cityData.lat}&lon=${cityData.lon}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.main) {
      return {
        city: data.name,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        condition: data.weather[0].main,
        icon: data.weather[0].icon,
        mapCoords: cityData.mapCoords // Keep existing map coordinates
      };
    }
  } catch (error) {
    console.error(`Error fetching live current weather for ${cityData.city}, falling back to mock:`, error);
  }
  
  return cityData; // Fallback to initial mock data if API fails
};

// Helper function to fetch 5-day FORECAST using the live API
const fetchLiveForecast = async (cityData) => {
  if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY_HERE" || API_KEY === "") {
    return MOCK_FETCH_FORECAST(cityData.city); // Fallback to mock
  }
  
  try {
    // Using the onecall endpoint for daily forecast
    const url = `${BASE_WEATHER_URL}/onecall?lat=${cityData.lat}&lon=${cityData.lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();

    if (data.daily) {
      return { daily: data.daily };
    }
  } catch (error) {
    console.error(`Error fetching live forecast for ${cityData.city}, falling back to mock:`, error);
  }

  return MOCK_FETCH_FORECAST(cityData.city); // Fallback to mock data if API fails
};


const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState(null); // For map hover effect
  const [isLiveMode, setIsLiveMode] = useState(false); // New state to track mode

  // 1. Initial Data Fetch (Live or Mock)
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        
        // Fetch current weather for all cities concurrently
        const dataPromises = CITIES_DATA.map(city => fetchLiveCurrentWeather(city));
        const initialData = await Promise.all(dataPromises);

        setWeatherData(initialData);
        setLoading(false);

        // Check if API key is set to enable "Live Mode" message
        if (API_KEY !== "YOUR_OPENWEATHERMAP_API_KEY_HERE" && API_KEY !== "") {
            setIsLiveMode(true);
        } else {
             // If key is missing, ensure we use mock data for initial state
             setWeatherData(MOCK_WEATHER_DATA);
        }

      } catch (error) {
        console.error("Critical error during initial data fetch:", error);
        setWeatherData(MOCK_WEATHER_DATA);
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, []);


  // 2. Forecast Data Fetch (Live or Mock)
  const fetchForecast = async (city) => {
    const cityData = weatherData.find(item => item.city === city);
    if (!cityData) return;

    try {
      setLoadingForecast(true);
      
      const response = await fetchLiveForecast(cityData);
      
      // Process data from mock or live API response
      const forecast = response.daily.map((day) => ({
        day: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temp_min: Math.round(day.temp.min), 
        temp_max: Math.round(day.temp.max), 
        // Correctly accessing nested weather data
        condition: day.weather[0].main, 
        icon: day.weather[0].icon,
      })).slice(0, 5); 

      // Update the specific city with its forecast
      setWeatherData(prevData => 
        prevData.map(item => 
          item.city === city 
            ? { ...item, forecast }
            : item
        )
      );
    } catch (error) {
      console.error('Error fetching forecast:', error);
    } finally {
      setLoadingForecast(false);
    }
  };

  // 3. Handle City Selection (from map pin click)
  const handleCityClick = (city) => {
    const currentCityData = weatherData.find(item => item.city === city);
    
    // Toggle selection
    if (selectedCity?.city === city) {
      setSelectedCity(null);
    } else {
      setSelectedCity(currentCityData);
      if (!currentCityData.forecast) {
         fetchForecast(city);
      }
    }
  };


  // Helper component to render the 5-day forecast
  const ForecastDisplay = ({ cityData }) => {
    if (!cityData || loadingForecast) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-500 mr-2" />
          {cityData ? <p className="text-gray-600">Loading forecast...</p> : <p className="text-gray-600">Select a city to view forecast.</p>}
        </div>
      );
    }

    if (!cityData.forecast) return <p className="text-center py-8 text-gray-500">Forecast data not available.</p>;

    return (
      <div className="grid grid-cols-5 gap-2 text-sm mt-4">
        {cityData.forecast.map((day) => (
          <div key={day.day} className="text-center p-2 border rounded-lg bg-emerald-100 shadow-inner">
            <div className="font-bold text-gray-700">{day.day}</div>
            <img
              src={getWeatherIcon(day.icon)}
              alt={day.condition}
              className="h-8 w-8 mx-auto my-1"
              onError={(e) => { e.target.src = "https://placehold.co/32x32/dddddd/333333?text=Icon"; }}
            />
            <div className="space-y-1">
              <div className="text-emerald-700 font-medium">
                {day.temp_max}°
              </div>
              <div className="text-gray-500 text-xs">
                {day.temp_min}°
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-600 p-4 text-white text-center">
          <h1 className="text-3xl font-extrabold">Pakistan Geographic & Weather Tracker</h1>
          <p className="text-sm font-light opacity-80">
            {isLiveMode 
             ? "LIVE WEATHER: Data fetched from OpenWeatherMap API." 
             : <span className="font-bold text-yellow-300">
                 MOCK DATA: Please insert your OpenWeatherMap API key in the code to enable live data.
               </span>
            }
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="animate-spin h-12 w-12 text-emerald-500" />
            <span className="ml-3 text-lg text-gray-700">Loading map and initial data...</span>
          </div>
        ) : (
          <div className="md:grid md:grid-cols-3">
            
            {/* Map Section (2/3 width) */}
            <div className="md:col-span-2 p-6 border-r border-gray-200">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Interactive Map</h2>
              
              <div className="w-full aspect-video max-h-[60vh] bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-2 border-4 border-gray-300 relative">
                
                <svg
                  viewBox="0 0 470 420"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                  style={{ transform: 'translateY(-20px)' }}
                >
                  {/* Map Regions */}
                  <g>
                    {REGIONS_DATA.map((region) => (
                      <path
                        key={region.id}
                        d={region.path}
                        fill={region.fill}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition duration-300 ease-in-out opacity-90"
                        onMouseEnter={() => setHoveredRegion(region.name)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        style={{ 
                            fill: hoveredRegion === region.name ? `${region.fill}` : `${region.fill}B0`,
                            filter: hoveredRegion === region.name ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))' : 'none',
                        }}
                      />
                    ))}
                  </g>

                  {/* City Markers (Map Pins) */}
                  <g>
                    {weatherData.map((cityData) => (
                      <g 
                        key={cityData.city}
                        transform={`translate(${cityData.mapCoords.x}, ${cityData.mapCoords.y})`}
                        className="cursor-pointer group"
                        onClick={() => handleCityClick(cityData.city)}
                      >
                        {/* Pin Background/Shadow */}
                        <circle cx="0" cy="0" r="15" fill="#fff" opacity="0.9" stroke="#10B981" strokeWidth="2" className="transition-all duration-200 group-hover:scale-125" />
                        
                        {/* Map Pin Icon */}
                        <MapPin size={24} x={-12} y={-12} fill="#10B981" stroke="#fff" strokeWidth={1} className="transition-all duration-200 group-hover:fill-red-500" />
                        
                        {/* Label */}
                        <text x="0" y="-20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#10B981" className="pointer-events-none transition-all duration-200 group-hover:text-red-500">
                          {cityData.city}
                        </text>
                      </g>
                    ))}
                  </g>

                </svg>
              </div>
              
              {/* Map Key */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Hovered Region: <span className="font-bold text-emerald-600">{hoveredRegion || 'N/A'}</span></p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                    {REGIONS_DATA.map(r => (
                        <span key={r.id} className="text-gray-600 flex items-center">
                            <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: r.fill }}></span>
                            {r.name}
                        </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Weather Sidebar (1/3 width) */}
            <div className="p-6 md:col-span-1 bg-emerald-50">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-emerald-200">
                Weather Forecast
              </h2>

              {selectedCity ? (
                <div className="space-y-6">
                  {/* Current Weather Card */}
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-emerald-200">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-3xl font-extrabold text-emerald-800">{selectedCity.city}</h3>
                      <img
                        src={getWeatherIcon(selectedCity.icon)}
                        alt={selectedCity.condition}
                        className="h-12 w-12 bg-gray-100 rounded-full"
                        onError={(e) => { e.target.src = "https://placehold.co/48x48/cccccc/333333?text=Icon"; }}
                      />
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center gap-2 text-red-600">
                        <Thermometer className="h-5 w-5" />
                        <span className="text-4xl font-black">{selectedCity.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600">
                        <Droplets className="h-4 w-4" />
                        <span className="text-md">{selectedCity.humidity}% Humidity</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Cloud className="h-4 w-4" />
                        <span className="capitalize font-semibold">{selectedCity.condition}</span>
                      </div>
                    </div>
                  </div>

                  {/* 5-Day Forecast Display */}
                  <div className="pt-2">
                    <h4 className="font-semibold mb-3 text-lg text-gray-700">5-Day Outlook</h4>
                    <ForecastDisplay cityData={selectedCity} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 border border-dashed border-emerald-300 p-4 rounded-xl">
                  <MapPin className="h-8 w-8 mx-auto mb-3 text-emerald-500" />
                  <p>Click on a city pin (e.g., Karachi) on the map to display its current weather and forecast here.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
