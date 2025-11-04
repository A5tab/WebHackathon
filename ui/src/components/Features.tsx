import { TrendingUp, CloudSun, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: TrendingUp,
    title: "Live Market Rates",
    description: "Track daily prices for 50+ vegetables and fruits across 20+ cities in Pakistan with 7-day trend charts.",
  },
  {
    icon: CloudSun,
    title: "Weather Insights",
    description: "Get real-time weather updates for your region including temperature, humidity, and rainfall predictions.",
  },
  {
    icon: MessageSquare,
    title: "Community Forum",
    description: "Connect with fellow farmers, share advice, ask questions, and learn from the agricultural community.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Everything You Need in One Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Empowering Pakistani farmers with the tools they need to make informed decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
            >
              <CardHeader>
                <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
