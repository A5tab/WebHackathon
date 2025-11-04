import { Button } from "@/components/ui/button";
import { TrendingUp, Cloud, Users } from "lucide-react";
import heroImage from "@/assets/hero-farmer.jpg";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-background via-secondary/30 to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Transparent market rates & weather insights for{" "}
              <span className="text-primary">farmers in Pakistan</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Daily prices, weather updates, and community advice — all in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")}>
                <TrendingUp className="mr-2 h-5 w-5" />
                View Market Rates
              </Button>
              <Button variant="accent" size="lg" onClick={() => navigate("/forum")}>
                <Users className="mr-2 h-5 w-5" />
                Join Forum
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Market Items</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-primary">20+</div>
                <div className="text-sm text-muted-foreground">Cities</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-primary">Daily</div>
                <div className="text-sm text-muted-foreground">Updates</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={heroImage} alt="Pakistani farmer checking market prices on smartphone" className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>

            {/* Floating Weather Card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border border-border hidden md:block">
              <div className="flex items-center gap-3">
                <Cloud className="h-8 w-8 text-accent" />
                <div>
                  <div className="text-sm text-muted-foreground">Weather</div>
                  <div className="font-semibold">28°C Lahore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
