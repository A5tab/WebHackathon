import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, Cloud, Lightbulb, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
// Mock market data
const marketData = [
  { id: 1, name: "Tomato", price: 120, unit: "kg", trend: 3, region: "Lahore", sparkline: [110, 112, 115, 118, 119, 121, 120] },
  { id: 2, name: "Potato", price: 45, unit: "kg", trend: -2, region: "Lahore", sparkline: [48, 47, 46, 46, 45, 45, 45] },
  { id: 3, name: "Onion", price: 80, unit: "kg", trend: 5, region: "Lahore", sparkline: [72, 74, 76, 77, 78, 79, 80] },
  { id: 4, name: "Carrot", price: 60, unit: "kg", trend: 1, region: "Lahore", sparkline: [58, 59, 59, 60, 60, 60, 60] },
  { id: 5, name: "Cabbage", price: 35, unit: "kg", trend: -1, region: "Lahore", sparkline: [36, 36, 35, 35, 35, 35, 35] },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("lahore");

  const {user} = useAuth();
  const filteredData = marketData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Track market prices and weather insights</p>
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
              <SelectItem value="lahore">Lahore</SelectItem>
              <SelectItem value="karachi">Karachi</SelectItem>
              <SelectItem value="islamabad">Islamabad</SelectItem>
              <SelectItem value="multan">Multan</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="accent" onClick={() => navigate("/dashboard")}>
            Compare Prices
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Market Prices Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Prices - {selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/30 cursor-pointer transition-colors"
                      onClick={() => navigate(`/item/${item.id}`)}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold text-primary">{item.price} PKR</span>
                          <span className="text-sm text-muted-foreground">/ {item.unit}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Mini Sparkline */}
                        <svg className="w-24 h-12 hidden md:block" viewBox="0 0 100 40">
                          <polyline
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            points={item.sparkline
                              .map((val, i) => {
                                const x = (i / (item.sparkline.length - 1)) * 100;
                                const y = 40 - ((val - Math.min(...item.sparkline)) / (Math.max(...item.sparkline) - Math.min(...item.sparkline))) * 30;
                                return `${x},${y}`;
                              })
                              .join(" ")}
                          />
                        </svg>

                        {/* Trend */}
                        <div className={`flex items-center gap-1 ${item.trend > 0 ? "text-green-600" : "text-red-600"}`}>
                          {item.trend > 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                          <span className="font-semibold">{Math.abs(item.trend)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Cards */}
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
                  <div className="text-center">
                    <div className="text-5xl font-bold text-foreground">28°C</div>
                    <div className="text-muted-foreground">{selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Humidity</div>
                      <div className="font-semibold">70%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Rain</div>
                      <div className="font-semibold">Expected</div>
                    </div>
                  </div>
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
                <p className="text-sm text-foreground mb-2">
                  <strong>Tomato prices rising</strong> — consider selling within next 2 days.
                </p>
                <p className="text-xs text-muted-foreground">AI-based recommendation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
