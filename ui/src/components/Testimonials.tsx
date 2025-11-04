import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Muhammad Akbar",
    location: "Lahore, Punjab",
    quote: "This app helped me get better prices for my tomatoes. I sold at the peak time and earned 20% more!",
  },
  {
    name: "Fatima Khan",
    location: "Multan, Punjab",
    quote: "The weather alerts saved my crops. I knew rain was coming and harvested early. Amazing tool!",
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Trusted by Farmers</h2>
          <p className="text-lg text-muted-foreground">See what our community has to say</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-2 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-accent mb-4" />
                <p className="text-lg mb-4 text-foreground italic">{testimonial.quote}</p>
                <div className="border-t border-border pt-4">
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
