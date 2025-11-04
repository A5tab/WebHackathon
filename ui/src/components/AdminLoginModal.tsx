/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../../src/api/axios.js";
import { useAuth } from "@/hooks/useAuth.js";

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminLoginModal = ({ open, onOpenChange }: AdminLoginModalProps) => {
  const { login } = useAuth();

  // 🧠 Manage form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Handle admin login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send login request to backend
      const response = await axiosInstance.post("/auth/login", { email, password });

      if (response.data?.token) {
        toast.success("✅ Admin login successful!");
        console.log(response.data);
        login(response.data.token, response.data.role, response.data.user.name);
        onOpenChange(false);
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      toast.error(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
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
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Frontend error message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" variant="default" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in as Admin"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
