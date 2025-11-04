import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, MessageSquare, ThumbsUp, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const posts = [
  {
    id: 1,
    title: "Tomato blight in Lahore — any suggestions?",
    author: "Akbar",
    time: "2 hours ago",
    excerpt: "I'm experiencing tomato blight in my farm. Has anyone dealt with this before? What treatments worked?",
    tags: ["Advice", "Tomato"],
    likes: 12,
    comments: 5,
  },
  {
    id: 2,
    title: "Best time to harvest potatoes?",
    author: "Fatima Khan",
    time: "5 hours ago",
    excerpt: "My potato plants are about 3 months old. When should I harvest them for the best market price?",
    tags: ["Questions", "Potato"],
    likes: 8,
    comments: 3,
  },
  {
    id: 3,
    title: "Fresh onions for sale - Multan",
    author: "Hassan Ali",
    time: "1 day ago",
    excerpt: "Selling fresh onions, 500kg available. Contact for wholesale prices.",
    tags: ["For Sale", "Onion"],
    likes: 15,
    comments: 7,
  },
];

const Forum = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Community Forum</h1>
          <p className="text-muted-foreground">Connect with fellow farmers and share knowledge</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["Advice", "For Sale", "Questions"].map((category) => (
                  <Button key={category} variant="ghost" className="w-full justify-start">
                    {category}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Button variant="hero" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </div>

          {/* Posts List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Posts */}
            {posts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/forum/${post.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span className="font-medium">{post.author}</span>
                        <span>•</span>
                        <span>{post.time}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
