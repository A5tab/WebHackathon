import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MessageSquare, Cloud, Lightbulb } from "lucide-react";
import { Navbar } from "@/components/Navbar";

// Generate last 7 days of prices with random fluctuations
const generatePrices = () => {
  const basePrice = 115; // Base price in PKR
  const dates = [];
  const prices = [];
  
  for (let i = 7; i >= 1; i--) {
    const date = new Date(2025, 10, 4 - i); // November 4, 2025 as reference
    dates.push(date.toISOString().split('T')[0]);
    
    // Generate random price fluctuation between -5 and +5 PKR
    const fluctuation = Math.floor(Math.random() * 10) - 5;
    prices.push(basePrice + fluctuation);
  }
  
  return dates.map((date, index) => ({
    date,
    price: prices[index]
  }));
};

// Mock detailed data with random prices
const itemDetails = {
  1: { 
    name: "Tomato",
    prices: generatePrices()
  },
};

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = itemDetails[Number(id) as keyof typeof itemDetails] || itemDetails[1];

  const maxPrice = Math.max(...item.prices.map(p => p.price));
  const minPrice = Math.min(...item.prices.map(p => p.price));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{item.name}</h1>
            <p className="text-muted-foreground">7-day price trend & insights</p>
          </div>
          <Button variant="outline" size="icon">
            <Star className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Card */}
            <Card>
              <CardHeader>
                <CardTitle>Price Trend (PKR/kg)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-64">
                  <svg className="w-full h-full" viewBox="0 0 600 250">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="40"
                        y1={50 + i * 40}
                        x2="580"
                        y2={50 + i * 40}
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Line chart */}
                    <polyline
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      points={item.prices
                        .map((p, i) => {
                          const x = 40 + (i / (item.prices.length - 1)) * 540;
                          const y = 210 - ((p.price - minPrice) / (maxPrice - minPrice)) * 160;
                          return `${x},${y}`;
                        })
                        .join(" ")}
                    />

                    {/* Points */}
                    {item.prices.map((p, i) => {
                      const x = 40 + (i / (item.prices.length - 1)) * 540;
                      const y = 210 - ((p.price - minPrice) / (maxPrice - minPrice)) * 160;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="5" fill="hsl(var(--primary))" />
                          <text x={x} y="240" textAnchor="middle" fontSize="12" fill="hsl(var(--muted-foreground))">
                            {p.date.slice(5)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Y-axis labels */}
                    {[maxPrice, Math.round((maxPrice + minPrice) / 2), minPrice].map((val, i) => (
                      <text key={i} x="5" y={50 + i * 80} fontSize="12" fill="hsl(var(--muted-foreground))">
                        {val}
                      </text>
                    ))}
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Historical Table */}
            <Card>
              <CardHeader>
                <CardTitle>Historical Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {item.prices.map((p) => (
                    <div key={p.date} className="flex justify-between items-center p-3 rounded-lg border border-border">
                      <span className="text-muted-foreground">{p.date}</span>
                      <span className="font-semibold text-foreground">{p.price} PKR/kg</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
