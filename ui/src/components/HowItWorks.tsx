import { UserPlus, Search, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your free farmer account in under 2 minutes",
  },
  {
    icon: Search,
    title: "Search Prices",
    description: "Browse live market rates for your crops and region",
  },
  {
    icon: TrendingUp,
    title: "Make Decisions",
    description: "Use insights and trends to sell at the right time",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How It Works</h2>
          <p className="text-lg text-muted-foreground">Get started in 3 simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center space-y-4">
              <div className="relative mx-auto w-fit">
                <div className="bg-primary/10 p-6 rounded-full">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground font-bold rounded-full w-8 h-8 flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
