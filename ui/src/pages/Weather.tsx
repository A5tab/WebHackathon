/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, Thermometer, Droplets, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import axios from "axios";

interface ForecastDay {
  day: string;
  temp_min: number;
  temp_max: number;
  condition: string;
  icon: string;
}

interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  condition: string;
  icon: string;
  forecast?: ForecastDay[];
}

interface WeatherForecast {
  daily: {
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: [{
      main: string;
      icon: string;
    }];
  }[];
}

const Weather = () => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        console.log('Fetching weather data...');
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('API URL:', `${baseUrl}/api/weather`);
        
        const response = await axios.get(`${baseUrl}/api/weather`);
        console.log('Weather data response:', response.data);
        setWeatherData(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching weather data:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWeatherColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return "bg-yellow-500";
      case "clouds":
        return "bg-gray-400";
      case "rain":
        return "bg-blue-400";
      case "snow":
        return "bg-blue-200";
      default:
        return "bg-gray-500";
    }
  };

  const fetchForecast = async (city: string) => {
    try {
      setLoadingForecast(true);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${baseUrl}/api/weather/forecast/${city}`);
      
      const forecast = response.data.daily.map((day: any) => ({
        day: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temp_min: Math.round(day.temp_min),
        temp_max: Math.round(day.temp_max),
        condition: day.weather.main,
        icon: day.weather.icon,
      }));

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

  const handleCityClick = (city: string) => {
    if (selectedCity === city) {
      setSelectedCity(null);
    } else {
      setSelectedCity(city);
      fetchForecast(city);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Weather Information</h1>
          <p className="text-muted-foreground">Current weather conditions in major cities</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weatherData.map((city) => (
              <Card 
                key={city.city} 
                className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedCity === city.city ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleCityClick(city.city)}
              >
                <div className={`h-2 ${getWeatherColor(city.condition)}`} />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{city.city}</span>
                    <img
                      src={getWeatherIcon(city.icon)}
                      alt={city.condition}
                      className="h-10 w-10"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5 text-red-500" />
                        <span className="text-xl font-semibold">{city.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <span>{city.humidity}% Humidity</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cloud className="h-5 w-5 text-gray-500" />
                      <span className="capitalize">{city.condition}</span>
                    </div>

                    {/* 7-Day Forecast */}
                    {selectedCity === city.city && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <h4 className="font-semibold mb-3">5-Day Forecast</h4>
                        {loadingForecast ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-5 gap-2 text-sm">
                            {city.forecast?.map((day) => (
                              <div key={day.day} className="text-center">
                                <div className="font-medium">{day.day}</div>
                                <img
                                  src={getWeatherIcon(day.icon)}
                                  alt={day.condition}
                                  className="h-8 w-8 mx-auto"
                                />
                                <div className="space-y-1">
                                  <div className="text-primary font-medium">
                                    {day.temp_max}°
                                  </div>
                                  <div className="text-muted-foreground">
                                    {day.temp_min}°
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Weather Advisory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Stay updated with real-time weather conditions to plan your farming activities effectively.
                Weather data is updated every hour for accuracy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Weather;