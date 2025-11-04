import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Login successful!");
    onOpenChange(false);
    navigate("/dashboard");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Account created successfully!");
    onOpenChange(false);
    navigate("/dashboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Farmer Portal</DialogTitle>
        </DialogHeader>

        <Tabs value={isLogin ? "login" : "register"} onValueChange={(v) => setIsLogin(v === "login")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email / Phone</Label>
                <Input id="login-email" placeholder="Enter email or phone" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" placeholder="Enter password" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </label>
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">
                Sign in as Farmer
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <Input id="register-name" placeholder="Enter your name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-phone">Phone Number</Label>
                <Input id="register-phone" placeholder="+92 300 1234567" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-region">Region</Label>
                <Select required>
                  <SelectTrigger id="register-region">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="punjab">Punjab</SelectItem>
                    <SelectItem value="sindh">Sindh</SelectItem>
                    <SelectItem value="kpk">Khyber Pakhtunkhwa</SelectItem>
                    <SelectItem value="balochistan">Balochistan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input id="register-password" type="password" placeholder="Create password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-confirm">Confirm Password</Label>
                <Input id="register-confirm" type="password" placeholder="Confirm password" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to the Terms & Conditions
                </label>
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">
                Create Farmer Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
