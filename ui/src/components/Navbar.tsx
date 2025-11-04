import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X } from "lucide-react";
import { LoginModal } from "./LoginModal";
import { AdminLoginModal } from "./AdminLoginModal";
import { useAuth } from "@/hooks/useAuth";
export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);

  const { user, logout } = useAuth();

  return (
    <>
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-foreground">SAMT</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">
                Testimonials
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            {
              !user ? (<div className="hidden md:flex items-center gap-3">
                <Button variant="ghost" onClick={() => setLoginModalOpen(true)}>
                  Login (Farmer)
                </Button>
                <Button variant="outline" onClick={() => setAdminLoginModalOpen(true)}>
                  Admin
                </Button>
              </div>) : <Button variant="hero" onClick={() => logout()}>
                Logout
              </Button>
            }

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-border">
              <a
                href="#features"
                className="block text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="block text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <div className="pt-2 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login (Farmer)
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setAdminLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Admin
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <AdminLoginModal open={adminLoginModalOpen} onOpenChange={setAdminLoginModalOpen} />
    </>
  );
};
