import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Plus, Search, Edit, Trash2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AddItemModal } from "@/components/ui/AddItemModal";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleAddItem = async (itemData: unknown) => {
    try {
      // You can implement the API call here
      // const response = await axios.post(${import.meta.env.VITE_API_URL}/api/market-items/add, itemData);
      // If itemData is FormData, log its entries for debugging
      if (itemData instanceof FormData) {
        for (const pair of itemData.entries()) {
          console.log(pair[0], pair[1]);
        }
      } else {
        console.log("Adding item:", itemData);
      }
      toast.success("Item added successfully");
      // You might want to refresh the items list here
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    }
  };

  const stats = [
    { title: "Total Entries", value: "342", icon: TrendingUp },
    { title: "Items Count", value: "50", icon: Plus },
    { title: "Avg Price Today", value: "75 PKR", icon: TrendingUp },
  ];

  const items = [
    { id: 1, name: "Tomato", region: "Lahore", price: 120, updated: "2025-11-02" },
    { id: 2, name: "Potato", region: "Lahore", price: 45, updated: "2025-11-02" },
    { id: 3, name: "Onion", region: "Karachi", price: 85, updated: "2025-11-02" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage market data and items</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost">
            <Upload className="mr-2 h-4 w-4" />
            Upload Daily CSV
          </Button>
          <Button variant="hero" onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Add Item Modal */}
        <AddItemModal 
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
          onAddItem={handleAddItem}
        />

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Market Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Item</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Region</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Latest Price</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Last Updated</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-secondary/30">
                      <td className="py-4 px-4 font-medium text-foreground">{item.name}</td>
                      <td className="py-4 px-4 text-foreground">{item.region}</td>
                      <td className="py-4 px-4 text-foreground">{item.price} PKR/kg</td>
                      <td className="py-4 px-4 text-muted-foreground">{item.updated}</td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;