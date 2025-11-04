import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Plus, Search, Edit, Trash2, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { AddItemModal } from "@/components/ui/AddItemModal";
import { EditItemModal } from "@/components/ui/EditItemModal";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "../api/axios.js";
import { it } from "node:test";

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // Add item handler
  const handleAddItem = async (formData: FormData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post("/market-items/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.item) {
        toast.success("Item added successfully!");
        setAddModalOpen(false);
        setItems((prev) => [...prev, res.data.item]);
      } else {
        toast.error(res.data?.message || "Error adding item");
      }
    } catch (error: any) {
      console.error("Error adding item:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add item");
    }
  };

  // Delete item handler
  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.delete(`/market-items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        toast.success("Item deleted successfully!");
      } else {
        toast.error(res.data?.message || "Error deleting item");
      }
    } catch (error: any) {
      console.error("Error deleting item:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  // Update item handler (passed to modal)
  const handleUpdateItem = async (id, formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.put(`/market-items/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.item) {
        toast.success("Item updated successfully!");
        setItems((prev) =>
          prev.map((i) => (i._id === id ? res.data.item : i))
        );
        setEditModalOpen(false);
      } else {
        toast.error(res.data?.message || "Error updating item");
      }
    } catch (error) {
      console.error("Error updating item:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update item");
    }
  };

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");

        const res = await axiosInstance.get("/market-items", {
          headers: { Authorization: `Bearer ${token}` },
          params: { search: searchQuery },
        });

        if (res.data) {
          setItems(res.data);
        } else {
          setItems([]);
          toast.info("No items found.");
        }
      } catch (error: any) {
        console.error("Error fetching items:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to fetch items");
        toast.error("Failed to load market items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchQuery]);

  const stats = [
    { title: "Total Entries", value: items.length.toString(), icon: TrendingUp },
    { title: "Items Count", value: items.length.toString(), icon: Plus },
    { title: "Avg Price Today", value: items.length ? (items.reduce((acc, curr) => acc + curr.pricePerKg, 0) / items.length).toFixed(2) + " PKR" : "N/A", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage market data and items</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
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

        {/* Edit Item Modal */}
        <EditItemModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          item={selectedItem}
          onUpdate={handleUpdateItem}
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
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Item
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Region
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Latest Price
                    </th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Last Updated
                    </th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-border hover:bg-secondary/30"
                    >
                      <td className="py-4 px-4 font-medium text-foreground">
                        {item.name}
                      </td>
                      <td className="py-4 px-4 text-foreground">
                        {item.region}
                      </td>
                      <td className="py-4 px-4 text-foreground">
                        {item.pricePerKg} PKR/kg
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {new Date(item.updatedAt).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setEditModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item._id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && (
                <p className="text-center text-muted-foreground py-4">
                  Loading items...
                </p>
              )}
              {!loading && items.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No items found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
