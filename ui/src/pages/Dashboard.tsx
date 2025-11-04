import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Cloud,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import axiosInstance from "@/api/axios";

interface MarketItem {
  _id: string;
  name: string;
  pricePerKg: number;
  region: string;
  category: string;
  date: string;
  imageUrl?: string;
  trend?: number;
  sparkline?: number[];
}

interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  condition: string;
  icon: string;
}

// Default sparkline data
const defaultSparkline = [0, 0, 0, 0, 0, 0, 0];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Punjab");
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [advice, setAdvice] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(true);

  // --- Fetch Market and Weather Data ---
  useEffect(() => {
    const fetchMarketItems = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/market-items", {
          params: { search: searchQuery },
        });
        setMarketItems(response.data);
        setError("");
      } catch (err) {
        console.error("Market fetch error:", err);
        setError("Failed to fetch market items");
      } finally {
        setLoading(false);
      }
    };

    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        const response = await axiosInstance.get("/weather");
        const regionWeather =
          response.data.find(
            (w: WeatherData) =>
              w.city.toLowerCase() === selectedRegion.toLowerCase()
          ) || response.data[0];
        setWeatherData(regionWeather);
      } catch (err) {
        console.error("Weather fetch error:", err);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchMarketItems();
    fetchWeather();
  }, [searchQuery, selectedRegion]);

  // --- Simplified trend calculation (mocked) ---
  const calculateTrend = (item: MarketItem) =>
    Math.floor(Math.random() * 11) - 5;

  const filteredData = marketItems
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((item) =>
      item.region.toLowerCase().includes(selectedRegion.toLowerCase())
    )
    .map((item) => ({
      ...item,
      id: item._id,
      price: item.pricePerKg,
      unit: "kg",
      trend: calculateTrend(item),
      sparkline: defaultSparkline,
    }));

  // --- Generate advice from backend (rule-based) ---
  useEffect(() => {
    const generateAdvice = async () => {
      if (!weatherData || filteredData.length === 0) return;

      try {
        const marketItem = filteredData[0];
        const response = await axiosInstance.post("/advice", {
          weather: {
            condition: weatherData.condition,
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
          },
          market: {
            name: marketItem.name,
            price: marketItem.price,
            trend: marketItem.trend,
          },
        });

        setAdvice(response.data.advice || "No advice available right now.");
      } catch (err) {
        console.error("Failed to generate advice:", err);
        setAdvice("Unable to generate advice at this time.");
      }
    };

    generateAdvice();
  }, [weatherData, filteredData]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Farmer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track market prices and weather insights
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Federal">Federal</SelectItem>
              <SelectItem value="Punjab">Punjab</SelectItem>
              <SelectItem value="Sindh">Sindh</SelectItem>
              <SelectItem value="Balochistan">Balochistan</SelectItem>
              <SelectItem value="KPK">KPK</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Market Prices Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Market Prices -{" "}
                  {selectedRegion.charAt(0).toUpperCase() +
                    selectedRegion.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4">
                      Loading market items...
                    </div>
                  ) : error ? (
                    <div className="text-center py-4 text-red-500">{error}</div>
                  ) : filteredData.length === 0 ? (
                    <div className="text-center py-4">No items found</div>
                  ) : (
                    filteredData.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/30 cursor-pointer transition-colors"
                        onClick={() => navigate(`/item/${item.id}`)}
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl font-bold text-primary">
                              {item.price} PKR
                            </span>
                            <span className="text-sm text-muted-foreground">
                              / {item.unit}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Mini Sparkline */}
                          <svg
                            className="w-24 h-12 hidden md:block"
                            viewBox="0 0 100 40"
                          >
                            <polyline
                              fill="none"
                              stroke="hsl(var(--primary))"
                              strokeWidth="2"
                              points={item.sparkline
                                .map((val, i) => {
                                  const x =
                                    (i / (item.sparkline.length - 1)) * 100;
                                  const y =
                                    40 -
                                    ((val - Math.min(...item.sparkline)) /
                                      (Math.max(...item.sparkline) -
                                        Math.min(...item.sparkline))) *
                                      30;
                                  return `${x},${y}`;
                                })
                                .join(" ")}
                            />
                          </svg>

                          {/* Trend */}
                          <div
                            className={`flex items-center gap-1 ${
                              item.trend > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.trend > 0 ? (
                              <TrendingUp className="h-5 w-5" />
                            ) : (
                              <TrendingDown className="h-5 w-5" />
                            )}
                            <span className="font-semibold">
                              {Math.abs(item.trend)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Card */}
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-accent" />
                  Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weatherLoading ? (
                    <div className="text-center py-4">Loading weather...</div>
                  ) : !weatherData ? (
                    <div className="text-center py-4 text-red-500">
                      Weather data unavailable
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="text-5xl font-bold text-foreground">
                          {Math.round(weatherData.temperature)}°C
                        </div>
                        <div className="text-muted-foreground">
                          {weatherData.city}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Humidity</div>
                          <div className="font-semibold">
                            {weatherData.humidity}%
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Condition</div>
                          <div className="font-semibold">
                            {weatherData.condition}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Smart Advice Card */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  Smart Advice
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!advice ? (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    Generating advice...
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-foreground mb-2">{advice}</p>
                    <p className="text-xs text-muted-foreground">
                      Smart farming recommendation
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
