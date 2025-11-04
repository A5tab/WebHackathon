import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}

export const EditItemModal = ({
  open,
  onOpenChange,
  item,
  onUpdate,
}: EditItemModalProps) => {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Load current item into form fields
  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setRegion(item.region || "");
      setPricePerKg(item.pricePerKg?.toString() || "");
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item?._id) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("region", region);
    formData.append("pricePerKg", pricePerKg);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      await onUpdate(item._id, formData);
      onOpenChange(false);
    } catch (err) {
      console.error("Error updating item:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter item name"
            />
          </div>

          <div>
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              placeholder="Enter region"
            />
          </div>

          <div>
            <Label htmlFor="price">Price (PKR/kg)</Label>
            <Input
              id="price"
              type="number"
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              required
              placeholder="Enter price per kg"
            />
          </div>

          <div>
            <Label htmlFor="image">Image (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemModal;