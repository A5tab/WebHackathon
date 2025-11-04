import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MessageSquare, Cloud, Lightbulb } from "lucide-react";
import { Navbar } from "@/components/Navbar";

// Mock detailed data
const itemDetails = {
  1: { name: "Tomato", prices: [
    { date: "2025-10-27", price: 110 },
    { date: "2025-10-28", price: 112 },
    { date: "2025-10-29", price: 115 },
    { date: "2025-10-30", price: 118 },
    { date: "2025-10-31", price: 119 },
    { date: "2025-11-01", price: 121 },
    { date: "2025-11-02", price: 120 },
  ]},
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather */}
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-accent" />
                  Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold">28°C</div>
                  <div className="text-sm text-muted-foreground">Lahore</div>
                  <div className="text-sm">Humidity: 70%</div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Advice */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  Smart Advice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  <strong>Tomato prices rising</strong> — consider selling within next 2 days.
                </p>
                <p className="text-xs text-muted-foreground">
                  Reason: Prices increased 3% in last 7 days and weather is favorable.
                </p>
                <p className="text-xs text-muted-foreground">Source: AI-based</p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button className="w-full" variant="hero">Compare Prices</Button>
              <Button className="w-full" variant="outline" onClick={() => navigate("/forum")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                View Forum Posts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
