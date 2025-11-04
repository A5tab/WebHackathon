import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, MessageSquare, ThumbsUp, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import axiosInstance from "@/api/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Comment {
  _id: string;
  commentText: string;
  author: {
    name: string;
    email: string;
  };
  post: string;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author?: {
    name: string;
    email: string;
  };
  likes: number;
  comments: Comment[];
  createdAt: string;
}

const getTimeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const mockPosts = [
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
  const { user, login } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCreateButtonClick = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      navigate("/login"); // Redirect to login page
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleCreatePost = async () => {
    // Check authentication first
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      setIsCreateModalOpen(false);
      navigate("/login");
      return;
    }

    // Validate inputs
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    // Validate title length
    if (newPost.title.trim().length < 5) {
      toast({
        title: "Error",
        description: "Title must be at least 5 characters long",
        variant: "destructive",
      });
      return;
    }

    // Validate content length
    if (newPost.content.trim().length < 20) {
      toast({
        title: "Error",
        description: "Content must be at least 20 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/forum/posts", {
        ...newPost,
        author: user.token, // Add author ID from the auth context
      });
      
      // If the post is created successfully, fetch the updated post list
      const updatedPostsResponse = await axiosInstance.get("/forum/posts");
      setPosts(updatedPostsResponse.data);
      
      setIsCreateModalOpen(false);
      setNewPost({ title: "", content: "" });
      toast({
        title: "Success",
        description: "Post created successfully",
      });
    } catch (err) {
      const error = err as Error & { response?: { status?: number; data?: { message?: string; details?: string } } };
      const errorMessage = error.response?.data?.message || error.response?.data?.details || "Failed to create post";
      
      if (error.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/forum/posts");
        console.log("Posts response:", response.data); // Debug log
        if (!Array.isArray(response.data)) {
          console.error("Invalid response format:", response.data);
          setError("Invalid response format from server");
          return;
        }
        setPosts(response.data);
        setError("");
      } catch (err) {
        const error = err as Error & { response?: { data?: { message?: string } } };
        console.error("Failed to fetch posts:", error.response?.data || error);
        setError(error.response?.data?.message || "Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search query and category
  const filteredPosts = posts.filter(post => {
    if (!post.title || !post.content) return false;
    const matchesSearch = (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || post.content.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

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
                  <Button 
                    key={category} 
                    variant={selectedCategory === category ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  >
                    {category}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Button 
              variant="hero" 
              className="w-full"
              onClick={handleCreateButtonClick}
            >
              <Plus className="mr-2 h-4 w-4" />
              {user ? "Create Post" : "Login to Post"}
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
            {loading ? (
              <div className="text-center py-8">Loading posts...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8">No posts found</div>
            ) : (
              filteredPosts.map((post) => (
                <Card
                  key={post._id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/forum/${post._id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <span className="font-medium">
                            {post.author?.name || "Anonymous"}
                          </span>
                          <span>•</span>
                          <span>{getTimeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      {post.content.length > 150 
                        ? `${post.content.substring(0, 150)}...` 
                        : post.content}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge variant="secondary">
                          {post.content.toLowerCase().includes("question") 
                            ? "Question" 
                            : post.content.toLowerCase().includes("sale") 
                            ? "For Sale" 
                            : "Advice"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments.length}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Share your farming experience or ask for advice from the community.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Write your post content here..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[200px]"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Forum;
