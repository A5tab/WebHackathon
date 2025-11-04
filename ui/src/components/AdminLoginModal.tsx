import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminLoginModal = ({ open, onOpenChange }: AdminLoginModalProps) => {
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Admin login successful!");
    onOpenChange(false);
    navigate("/admin");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Admin Login</DialogTitle>
          <p className="text-sm text-muted-foreground">Use your assigned credentials</p>
        </DialogHeader>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input id="admin-email" type="email" placeholder="admin@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input id="admin-password" type="password" placeholder="Enter admin password" required />
          </div>
          <Button type="submit" variant="default" size="lg" className="w-full">
            Sign in as Admin
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
