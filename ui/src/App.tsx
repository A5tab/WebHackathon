import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ItemDetail from "./pages/ItemDetail";
import Admin from "./pages/Admin";
import Forum from "./pages/Forum";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <Routes>
        <Route path="/" element={<Index />} />

        {/* Farmer Protected Route */}
        <Route element={<ProtectedRoute allowedRoles={["farmer"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forum" element={<Forum />} />
        </Route>

        {/* Admin Protected Route */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
